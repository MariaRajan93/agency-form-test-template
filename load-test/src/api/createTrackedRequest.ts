import { performGapiOperation } from "./performGapiOperation.ts";
import type { MyQldCreateTrackedRequestInput } from "../../../libs/types/gql.d.ts"

type Props = {
    accessToken: string;
    customerId: string;
    serviceId: string;
    serviceInteractionId: string;
    input: MyQldCreateTrackedRequestInput;
};

export enum GapiSubjectId {
    AGENT = "agent",
    CITIZEN = "citizen",
}

type CreateTrackedRequestResponse = { myQLDCreateTrackedRequest: { reference: string } };

export const createTrackedRequest = async ({
    accessToken,
    customerId,
    serviceId,
    serviceInteractionId,
    input,
}: Props) => {
    const res = await performGapiOperation<CreateTrackedRequestResponse>({
        accessToken,
        operationName: "MyQLDCreateTrackedRequest",
        query: query,
        variables: { customerId, serviceId, serviceInteractionId, input },
    });
    return res.myQLDCreateTrackedRequest.reference;
};

const query = `
    mutation MyQLDCreateTrackedRequest(
        $input: MyQLDCreateTrackedRequestInput!
        $customerId: String!
        $serviceId: String!
        $serviceInteractionId: String!
    ) {
        myQLDCreateTrackedRequest(
            input: $input
            customerId: $customerId
            serviceId: $serviceId
            serviceInteractionId: $serviceInteractionId
        ) {
            reference
        }
    }
`;
