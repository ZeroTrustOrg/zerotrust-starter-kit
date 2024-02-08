import { PimlicoPaymasterRpcSchema } from "node_modules/permissionless/_types/types/pimlico"
import { UserOperationWithBigIntAsHex } from "node_modules/permissionless/_types/types/userOperation"
import { PimlocoSponsorUserOperationParameters } from "permissionless/actions/pimlico"
import { PimlicoPaymasterClient } from "permissionless/clients/pimlico"
import { Account, Chain, Client, Hex, PublicClientConfig, Transport, createClient, toHex } from "viem"

export type PimlicoPaymasterV1Client = Client<
    Transport,
    Chain | undefined,
    Account | undefined,
    PimlicoPaymasterRpcSchema,
    PimlicoPaymasterV1ClientActions
>

export type SponsorUserOperationV1ReturnType = {
  paymasterAndData: Hex
}

export const createPimlicoPaymasterV1Client = <
    transport extends Transport,
    chain extends Chain | undefined = undefined
>(
    parameters: PublicClientConfig<transport, chain>
): PimlicoPaymasterV1Client => {
    const { key = "public", name = "Pimlico Paymaster Client" } = parameters
    const client = createClient({
        ...parameters,
        key,
        name,
        type: "pimlicoPaymasterClient"
    })
    return client.extend(pimlicoPaymasterV1Actions)
}

export type PimlicoPaymasterV1ClientActions = {
    sponsorUserOperationV1: (
        args: PimlocoSponsorUserOperationParameters
    ) => Promise<SponsorUserOperationV1ReturnType>
}

export const pimlicoPaymasterV1Actions = (
    client: Client
): PimlicoPaymasterV1ClientActions => ({
    sponsorUserOperationV1: async (args: PimlocoSponsorUserOperationParameters) =>
        sponsorUserOperationV1(client as PimlicoPaymasterClient, args),
})

export const sponsorUserOperationV1 = async <
    TTransport extends Transport = Transport,
    TChain extends Chain | undefined = Chain | undefined,
    TAccount extends Account | undefined = Account | undefined
>(
    client: Client<TTransport, TChain, TAccount, PimlicoPaymasterRpcSchema>,
    args: PimlocoSponsorUserOperationParameters
): Promise<SponsorUserOperationV1ReturnType> => {
    const response = await client.request({
        method: "pm_sponsorUserOperation",
        params: args.sponsorshipPolicyId
            ? [
                  deepHexlify(
                      args.userOperation
                  ) as UserOperationWithBigIntAsHex,
                  args.entryPoint,
                  {
                      sponsorshipPolicyId: args.sponsorshipPolicyId
                  }
              ]
            : [
                  deepHexlify(
                      args.userOperation
                  ) as UserOperationWithBigIntAsHex,
                  args.entryPoint
              ]
    })

    return {
        paymasterAndData: response.paymasterAndData,
    }
}

// biome-ignore lint/suspicious/noExplicitAny: it's a recursive function, so it's hard to type
export function deepHexlify(obj: any): any {
    if (typeof obj === "function") {
        return undefined
    }
    if (obj == null || typeof obj === "string" || typeof obj === "boolean") {
        return obj
    }

    if (typeof obj === "bigint") {
        return toHex(obj)
    }

    if (obj._isBigNumber != null || typeof obj !== "object") {
        return toHex(obj).replace(/^0x0/, "0x")
    }
    if (Array.isArray(obj)) {
        return obj.map((member) => deepHexlify(member))
    }
    return Object.keys(obj).reduce(
        // biome-ignore lint/suspicious/noExplicitAny: it's a recursive function, so it's hard to type
        (set: any, key: string) => {
            set[key] = deepHexlify(obj[key])
            return set
        },
        {}
    )
}