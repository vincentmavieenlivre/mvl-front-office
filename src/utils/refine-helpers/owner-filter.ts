import { ERoles } from "@app/modeles/database/roles";
import { FieldPath } from "firebase/firestore";

export function getOwnerFilter(currentUserId: string, currentRole: ERoles) {
    const path = new FieldPath("owners", "owner_ids")

    const filters: any = {
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