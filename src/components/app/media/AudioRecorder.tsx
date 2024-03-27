import { SearchOutlined, SoundOutlined } from "@ant-design/icons";
import { functions, storage } from "@app/init/firebase";
import { UserProjectQuestionManager } from "@app/manager/client/user-project-question.manager";
import { IBookQuestion } from "@app/modeles/database/book/book-question";
import { Button, Spin } from "antd";
import { httpsCallable } from "firebase/functions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState, useRef, Ref, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";

const audioMimeType = "audio/webm";

type Props = {
	question: IBookQuestion;
	projectId: string;
	mockedText?: string;
}

const AudioRecorder = (props: Props) => {

	const [permission, setPermission] = useState(false);

	const mediaRecorder = useRef<any>(null);

	const [recordingStatus, setRecordingStatus] = useState("inactive");

	const [stream, setStream] = useState<MediaStream | undefined>(undefined);

	const [audio, setAudio] = useState(null);

	const [audioChunks, setAudioChunks] = useState([]);

	const [transcribedText, setTranscribedText] = useState<string | undefined>(undefined)

	const [processing, setProcessing] = useState<boolean>(false)




	const transcriptAudioToText = async (audioUrl: string) => {
		if (functions) {
			const test = httpsCallable(functions, 'speechToText');
			let result = await test({ audioUrl: audioUrl })
			console.log("[transcripted text]", result)
			return result
		}
	}

	const getMicrophonePermission = async () => {
		/* 		if ("MediaRecorder" in window) {
					try {
						const mediaStream = await navigator.mediaDevices.getUserMedia({
							audio: true,
							video: false,
						});
						setPermission(true);
						setStream(mediaStream);
					} catch (err) {
						alert(err.message);
					}
				} else {
					alert("The MediaRecorder API is not supported in your browser.");
				} */
	};

	const getStream = async () => {
		const mediaStream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: false,
		});
		setStream(mediaStream);
	}

	useEffect(() => {
		getStream()
	}, [])



	const startRecording = async () => {

		if (!stream) {
			return
		}

		setRecordingStatus("recording");
		const media = new MediaRecorder(stream, { mimeType: audioMimeType });

		mediaRecorder.current = media;
		mediaRecorder.current.start();

		let localAudioChunks: any = [];

		mediaRecorder.current.ondataavailable = (event: any) => {

			if (typeof event.data === "undefined") return;
			if (event.data.size === 0) return;
			localAudioChunks.push(event.data);
		};

		setAudioChunks(localAudioChunks);
	};


	const doProcess = async (downloadUrl) => {
		console.log("go transcript cloud function")
		let data = await transcriptAudioToText(downloadUrl)
		console.log("transcript res", data?.data.text)
		setTranscribedText(data?.data.text)
		setProcessing(false)
	}

	const stopRecording = () => {
		setRecordingStatus("inactive");
		mediaRecorder.current.stop();

		mediaRecorder.current.onstop = async () => {

			try {
				setProcessing(true)
				const audioBlob = new Blob(audioChunks, { type: audioMimeType });
				const audioUrl = URL.createObjectURL(audioBlob);
				console.log("audioUrl", audioUrl)
				setAudio(audioUrl);
				setAudioChunks([]);
				let downloadUrl: string = await uploadAudioOnStorage(audioBlob)
				if (downloadUrl) {
					doProcess(downloadUrl)
				}

			} catch (error) {
				setProcessing(false)
			}


		};
	};

	const uploadAudioOnStorage = async (audioFileBlob: Blob) => {
		if (!storage) return

		const metadata = {
			contentType: audioMimeType
		}

		let audioStorageRef = ref(storage, `projects/${props.projectId}/questions/${props.question}/answer.webm`);

		try {
			console.log("custom upload go for", audioFileBlob)
			let resSnapshot = await uploadBytes(audioStorageRef, audioFileBlob)
			console.log('Uploaded the audio blob', resSnapshot);

			let downloadURL = await getDownloadURL(resSnapshot.ref)
			console.log('File available at', downloadURL);

			let qm = new UserProjectQuestionManager(props.projectId, props.question)
			let audioUrl: string = await qm.updateAudioUrl(downloadURL)
			console.log("audio url", audioUrl)


			return downloadURL
		} catch (e) {
			console.error(e)
		}
	};

	return (
		<div>

			{/* <div>
				{props.question.audioUrl &&
					<div>	{props.question.audioUrl} </div>
				}
			</div>
			 */}
			<main>

				<div className="audio-controls flex flex-row items-center">
					{/* 	{!permission ? (
						<button onClick={getMicrophonePermission} type="button">
							Get Microphone
						</button>
					) : null} */}
					{recordingStatus === "inactive" ? (
						<Button onClick={startRecording} className="m-4" icon={<SoundOutlined />}>Enregistrer votre réponse</Button>

					) : null}
					{recordingStatus === "recording" ? (
						<Button onClick={stopRecording} className="m-4" icon={<SoundOutlined />}>Terminer l'enregistrement</Button>

					) : null}

					{processing == true &&
						<Spin size="small" />
					}

					<div onClick={() => setTranscribedText(props.mockedText)} style={{ width: 100, height: 20, cursor: "pointer" }}></div>
				</div>




				{transcribedText &&
					<div>

						<TypeAnimation
							sequence={[
								transcribedText
							]}
							wrapper="span"
							speed={75}
							style={{ fontSize: '2em', display: 'inline-block' }}

						/>
					</div>
				}

				{props.question.audioUrl || audio ? (
					<div className="audio-player mt-4">
						<audio src={props.question.audioUrl || audio} controls >


						</audio>
						{/* <a download href={audio}>
							Download Recording
						</a> */}
					</div>
				) : null}
			</main>


		</div>
	);
};

export default AudioRecorder;
