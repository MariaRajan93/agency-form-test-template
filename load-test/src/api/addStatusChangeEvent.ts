import { performGapiOperation } from "./performGapiOperation.ts";
import type { MyQldAddStatusChangeEventInput } from "../../../libs/types/gql.d.ts"

type Props = {
    accessToken: string;
    customerId: string;
    serviceId: string;
    serviceInteractionId: string;
    referenceNum: string;
    input: MyQldAddStatusChangeEventInput;
};

type Data = { myQLDAddStatusChangeEvent: { reference: string } };

export const addStatusChangeEvent = async ({
    accessToken,
    customerId,
    serviceId,
    serviceInteractionId,
    referenceNum,
    input,
}: Props) => {
    const res = await performGapiOperation<Data>({
        accessToken,
        operationName: "MyQldAddStatusChangeEvent",
        query: query,
        variables: { customerId, serviceId, serviceInteractionId, referenceNum, input },
    });
    return res.myQLDAddStatusChangeEvent.reference;
};

const query = `mutation MyQldAddStatusChangeEvent(
        $customerId: String!
        $serviceId: String!
        $serviceInteractionId: String!
        $referenceNum: String!
        $input: MyQLDAddStatusChangeEventInput!
    ) {
        myQLDAddStatusChangeEvent(
            customerId: $customerId
            serviceId: $serviceId
            serviceInteractionId: $serviceInteractionId
            referenceNum: $referenceNum
            input: $input
        ) {
            reference
        }
    }
`;
