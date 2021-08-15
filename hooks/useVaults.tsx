import { Web3Provider } from '@ethersproject/providers'
import { VAULT_TOKENS } from '@inverse/config'
import { SWR } from '@inverse/types'
import { fetcher } from '@inverse/util/web3'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import useSWR from 'swr'
import useEtherSWR from './useEtherSWR'

type Rates = {
  lastDistribution?: Date
  rates: { [key: string]: number }
}

type Rewards = {
  rewards: { [key: string]: number }
}

export const useVaultRates = (): SWR & Rates => {
  // const { data, error } = useSWR(`${process.env.API_URL}/vaults`, fetcher)

  const data = {"lastDistribution":1627520493,"rates":{"0x83C2D4F52FbA1167F164ACddFCBD6710dDB27192":4.206300189715499,"0xc8f2E91dC9d198edEd1b2778F6f2a7fd5bBeac34":12.107533698000001,"0x41D079ce7282d49bf4888C71B5D9E4A02c371F9B":5.8053468213935995,"0x2dCdCA085af2E258654e47204e483127E0D8b277":5.8109493273984}}
  const error = false
  return {
    lastDistribution: data ? new Date(data.lastDistribution * 1000) : undefined,
    rates: data?.rates,
    isLoading: !error && !data,
    isError: error,
  }
}

export const useVaultRewards = (): SWR & Rewards => {
  const { account } = useWeb3React<Web3Provider>()
  const { data, error } = useEtherSWR(VAULT_TOKENS.map((address: string) => [address, 'unclaimedProfit', account]))

  return {
    rewards: data?.reduce((rewards: { [key: string]: BigNumber }, reward: BigNumber, i: number) => {
      rewards[VAULT_TOKENS[i]] = reward
      return rewards
    }, {}),
    isLoading: !error && !data,
    isError: error,
  }
}
