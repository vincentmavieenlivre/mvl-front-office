import { ERoles } from "@app/modeles/roles";
import { FieldPath } from "firebase/firestore";

export function getOwnerFilter(currentUserId: string, currentRole: ERoles) {
    const path = new FieldPath("owners", "owner_ids")

    let filters: any = {
        initial: [

        ]
    }

    switch (currentRole) {
        case ERoles.SUPER_ADMIN:

            break;
        case ERoles.BIOGRAPHER:
            filters.initial.push({
                field: path,
                operator: "contains",
                value: currentUserId
            })
            break
        default:
            break;
    }

    console.log("filter", filters)

    return filters
}