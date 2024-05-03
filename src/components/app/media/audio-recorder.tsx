import { SearchOutlined, SoundOutlined } from "@ant-design/icons";
import { functions, storage } from "@app/init/firebase";
import { UserProjectQuestionManager } from "@app/manager/client/user-project-question.manager";
import { IBookQuestion } from "@app/modeles/database/book/book-question";
import { Button, Spin } from "antd";
import { httpsCallable } from "firebase/functions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useImperativeHandle } from "react";
import { useState, useRef, Ref, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import { TbTrashXFilled } from "react-icons/tb";
import Player, { playerIconSize } from "./player";
import { IActionRecordStates } from "@app/pages/app/projects/questions/record-button/record.button";
import { IRecord } from "@app/modeles/database/book/response";

const audioMimeType = "audio/webm";

type Props = {
	question: IBookQuestion;
	projectId: string;
	mockedText?: string;
	onNewAudioRecorded: (audio: IRecord) => Promise<any>
	state: IActionRecordStates
}

enum ERecordingStatus {
	INACTIVE = "INACTIVE",
	RECORDING = "RECORDING"
}

export interface IActionRecordRef {
	startRecording: () => void;
	stopRecording: () => void;
	getFinished: () => boolean
}


const AudioRecorder = React.forwardRef<IActionRecordRef, Props>((props: Props, ref) => {



	const [permission, setPermission] = useState(false);

	const mediaRecorder = useRef<any>(null);

	const [recordingStatus, setRecordingStatus] = useState<ERecordingStatus>(ERecordingStatus.INACTIVE);

	const [stream, setStream] = useState<MediaStream | undefined>(undefined);

	const [audio, setAudio] = useState<IRecord | null>(null);

	const [audioChunks, setAudioChunks] = useState([]);

	const [transcribedText, setTranscribedText] = useState<string | undefined>(undefined)

	const [processing, setProcessing] = useState<boolean>(false)

	const [finish, setFinish] = useState(false)

	useEffect(() => {
		if (audio) {
			props.onNewAudioRecorded(audio).then(() => {
				setFinish(true)
			})
		}

	}, [audio])


	useImperativeHandle(ref, () => {
		return {
			startRecording() {
				setRecordingStatus(ERecordingStatus.RECORDING)
				// console.log("startRecording", recordingStatus)
			},
			stopRecording() {
				// console.log("stopRecording", recordingStatus, " <----------- SOULD BE RECORDING")
				if (recordingStatus == ERecordingStatus.RECORDING) {
					stopRecording()
				}
			},
			getFinished() {
				return finish
			}
		};
	}, [recordingStatus, stream, audioChunks, finish]);


	useEffect(() => {
		// console.log("------------------ recording status", recordingStatus)
	}, [recordingStatus])

	useEffect(() => {
		/* 	getStream() */
		getMicrophonePermission()
	}, [])

	const transcriptAudioToText = async (audioUrl: string) => {
		if (functions) {
			const test = httpsCallable(functions, 'speechToText');
			const result = await test({ audioUrl: audioUrl })
			console.log("[transcripted text]", result)
			return result
		}
	}

	const getMicrophonePermission = async () => {
		if ("MediaRecorder" in window) {
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
		}
	};

	const getStream = async () => {
		const mediaStream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: false,
		});
		console.log("------- stream is ready")
		setStream(mediaStream);
	}


	useEffect(() => {

		// console.log("<audiorecorder> RECORDING_STATUS", recordingStatus)

		if (recordingStatus == ERecordingStatus.RECORDING) {
			console.log("use effect getStream => sould start recording", stream)
			startRecording()
		}
	}, [recordingStatus])




	const startRecording = async () => {
		console.log("<Audiorecorder> startRecording")

		if (!stream) {
			console.error("stream is null")
			return
		}

		const media = new MediaRecorder(stream, { mimeType: audioMimeType });

		mediaRecorder.current = media;
		mediaRecorder.current.start();

		const localAudioChunks: any = [];

		mediaRecorder.current.ondataavailable = (event: any) => {
			// console.log("data chunck", event.size)
			if (typeof event.data === "undefined") return;
			if (event.data.size === 0) return;
			localAudioChunks.push(event.data);
		};

		setAudioChunks(localAudioChunks);
	};


	const transcribeAudioToText = async (downloadUrl) => {
		console.log("go transcript cloud function")
		const data = await transcriptAudioToText(downloadUrl)
		console.log("transcript res", data?.data.text)
		setTranscribedText(data?.data.text)
		setProcessing(false)
	}


	// upload
	// transcribe
	const stopRecording = () => {
		// console.log("<Audiorecorder> stopRecording")


		mediaRecorder.current.stop();

		mediaRecorder.current.onstop = async () => {
			// console.log("<Audiorecorder> event mediarecorder onStopRecording ")

			try {
				setProcessing(true)
				const audioBlob = new Blob(audioChunks, { type: audioMimeType });
				// console.log("audio blob", audioBlob)
				const audioUrl = URL.createObjectURL(audioBlob);
				// console.log("--------------------- audioUrl for record", audioUrl)
				setAudio(
					{
						audioUrl: audioUrl,
						audioBlob: audioBlob
					}
				);
				setAudioChunks([]);
				setProcessing(false)
				setRecordingStatus(ERecordingStatus.INACTIVE)

				// console.warn("do not upload on firestore")
				/* 	const downloadUrl: string = await uploadAudioOnStorage(audioBlob)
					if (downloadUrl) {
						transcribeAudioToText(downloadUrl)
					}
	 */

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

		// console.log("<Audiorecorder> uploadAudioOnStorage")
		const audioStorageRef = ref(storage, `projects/${props.projectId}/questions/${props.question.id}/answer.webm`);

		try {
			console.log("custom upload go for", audioFileBlob)
			const resSnapshot = await uploadBytes(audioStorageRef, audioFileBlob)
			console.log('Uploaded the audio blob', resSnapshot);

			const downloadURL = await getDownloadURL(resSnapshot.ref)
			console.log('File available at', downloadURL);

			const qm = new UserProjectQuestionManager(props.projectId, props.question)
			const audioUrl: string = await qm.updateAudioUrl(downloadURL)
			console.log("audio url", audioUrl)


			return downloadURL
		} catch (e) {
			console.error(e)
		}
	};

	return (
		<div className="">



		</div>


	);
});

export default AudioRecorder;
