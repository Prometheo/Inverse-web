import { Web3Provider } from '@ethersproject/providers'
import { DAI, DOLA, DOLA3CRV, STABILIZER, STAKING_DOLA3CRV, UNDERLYING } from '@inverse/config'
import useEtherSWR from '@inverse/hooks/useEtherSWR'
import { SWR } from '@inverse/types'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'

type Approvals = {
  approvals: { [key: string]: BigNumber }
}

export const useApprovals = (): SWR & Approvals => {
  const tokens = Object.entries(UNDERLYING).filter(([_, { address }]) => address)

  const { account } = useWeb3React<Web3Provider>()
  const { data, error } = useEtherSWR(
    tokens.map(([address, underlying]) => [underlying.address, 'allowance', account, address])
  )

  return {
    approvals: data?.reduce((approvals: { [key: string]: BigNumber }, approval: BigNumber, i: number) => {
      approvals[tokens[i][0]] = approval
      return approvals
    }, {}),
    isLoading: !error && !data,
    isError: error,
  }
}

export const useStabilizerApprovals = (): SWR & Approvals => {
  const { account } = useWeb3React<Web3Provider>()
  const { data, error } = useEtherSWR([
    [DAI, 'allowance', account, STABILIZER],
    [DOLA, 'allowance', account, STABILIZER],
  ])

  return {
    approvals: data
      ? {
          [DAI]: data[0],
          [DOLA]: data[1],
        }
      : {},
    isLoading: !error && !data,
    isError: error,
  }
}

export const useStakingApprovals = (): SWR & Approvals => {
  const { account } = useWeb3React<Web3Provider>()
  const { data, error } = useEtherSWR([DOLA3CRV, 'allowance', account, STAKING_DOLA3CRV])

  return {
    approvals: data
      ? {
          [DOLA3CRV]: data,
        }
      : {},
    isLoading: !error && !data,
    isError: error,
  }
}
