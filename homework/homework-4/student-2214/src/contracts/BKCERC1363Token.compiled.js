// 本文件由 scripts/compile-bkc-contract.mjs 生成，请修改 Solidity 源码后重新生成。
export const BKC_TOKEN_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "initialSupply",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "AccountFrozen",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "AccountNotFrozen",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ArrayLengthMismatch",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "allowance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSpender",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "EmptyArray",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "provided",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "max",
        "type": "uint256"
      }
    ],
    "name": "ExceedsMaxBatchSize",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotERC1363Receiver",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotERC1363Spender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ZeroAddress",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "frozen",
        "type": "bool"
      }
    ],
    "name": "AccountFreeze",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "recipients",
        "type": "address[]"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalMinted",
        "type": "uint256"
      }
    ],
    "name": "BatchMint",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "MAX_BATCH_SIZE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approveAndCall",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "approveAndCall",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "accounts",
        "type": "address[]"
      }
    ],
    "name": "batchFreeze",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "recipients",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "name": "batchMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "recipients",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "batchMintEqual",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "freeze",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isFrozen",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferAndCall",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "transferAndCall",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "transferFromAndCall",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFromAndCall",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "unfreeze",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export const BKC_TOKEN_BYTECODE = '0x608060405234801561000f575f5ffd5b5060405161208438038061208483398101604081905261002e916103eb565b808484600361003d8382610506565b50600461004a8282610506565b5050506001600160a01b03811661007b57604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b610084816100df565b5060016006556001600160a01b0381166100b15760405163d92e233d60e01b815260040160405180910390fd5b81156100d6576100d6816100c76012600a6106bd565b6100d190856106d2565b610130565b505050506106fc565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b6001600160a01b0382166101595760405163ec442f0560e01b81525f6004820152602401610072565b6101645f8383610168565b5050565b6001600160a01b0383161580159061019757506001600160a01b0383165f9081526007602052604090205460ff165b156101c0576040516327951b3f60e11b81526001600160a01b0384166004820152602401610072565b6001600160a01b038216158015906101ef57506001600160a01b0382165f9081526007602052604090205460ff165b15610218576040516327951b3f60e11b81526001600160a01b0383166004820152602401610072565b610223838383610228565b505050565b6001600160a01b038316610252578060025f82825461024791906106e9565b909155506102c29050565b6001600160a01b0383165f90815260208190526040902054818110156102a45760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401610072565b6001600160a01b0384165f9081526020819052604090209082900390555b6001600160a01b0382166102de576002805482900390556102fc565b6001600160a01b0382165f9081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161034191815260200190565b60405180910390a3505050565b634e487b7160e01b5f52604160045260245ffd5b5f82601f830112610371575f5ffd5b81516001600160401b0381111561038a5761038a61034e565b604051601f8201601f19908116603f011681016001600160401b03811182821017156103b8576103b861034e565b6040528181528382016020018510156103cf575f5ffd5b8160208501602083015e5f918101602001919091529392505050565b5f5f5f5f608085870312156103fe575f5ffd5b84516001600160401b03811115610413575f5ffd5b61041f87828801610362565b602087015190955090506001600160401b0381111561043c575f5ffd5b61044887828801610362565b60408701516060880151919550935090506001600160a01b038116811461046d575f5ffd5b939692955090935050565b600181811c9082168061048c57607f821691505b6020821081036104aa57634e487b7160e01b5f52602260045260245ffd5b50919050565b601f821115610223578282111561022357805f5260205f20601f840160051c60208510156104db57505f5b90810190601f840160051c035f5b818110156104fe575f838201556001016104e9565b505050505050565b81516001600160401b0381111561051f5761051f61034e565b6105338161052d8454610478565b846104b0565b6020601f821160018114610565575f831561054e5750848201515b5f19600385901b1c1916600184901b1784556105bd565b5f84815260208120601f198516915b828110156105945787850151825560209485019460019092019101610574565b50848210156105b157868401515f19600387901b60f8161c191681555b505060018360011b0184555b5050505050565b634e487b7160e01b5f52601160045260245ffd5b6001815b6001841115610613578085048111156105f7576105f76105c4565b600184161561060557908102905b60019390931c9280026105dc565b935093915050565b5f82610629575060016106b7565b8161063557505f6106b7565b816001811461064b576002811461065557610671565b60019150506106b7565b60ff841115610666576106666105c4565b50506001821b6106b7565b5060208310610133831016604e8410600b8410161715610694575081810a6106b7565b6106a05f1984846105d8565b805f19048211156106b3576106b36105c4565b0290505b92915050565b5f6106cb60ff84168361061b565b9392505050565b80820281158282048414176106b7576106b76105c4565b808201808211156106b7576106b76105c4565b61197b806107095f395ff3fe608060405234801561000f575f5ffd5b50600436106101a1575f3560e01c806368573107116100f3578063c1d34b8911610093578063d8fbe9941161006e578063d8fbe9941461036a578063dd62ed3e1461037d578063e583983614610390578063f2fde38b146103bb575f5ffd5b8063c1d34b891461033c578063cae9ca511461034f578063cfdbf25414610362575f5ffd5b80638d1fdf2f116100ce5780638d1fdf2f146102f35780638da5cb5b1461030657806395d89b4114610321578063a9059cbb14610329575f5ffd5b806368573107146102b057806370a08231146102c3578063715018a6146102eb575f5ffd5b8063313ce5671161015e57806340c10f191161013957806340c10f191461026257806345c8b1a61461027757806360ea92081461028a578063656e48541461029d575f5ffd5b8063313ce5671461022d5780633177029f1461023c5780634000aea01461024f575f5ffd5b806301ffc9a7146101a557806306fdde03146101cd578063095ea7b3146101e25780631296ee62146101f557806318160ddd1461020857806323b872dd1461021a575b5f5ffd5b6101b86101b33660046113ea565b6103ce565b60405190151581526020015b60405180910390f35b6101d561041f565b6040516101c49190611433565b6101b86101f0366004611460565b6104af565b6101b8610203366004611460565b6104c6565b6002545b6040519081526020016101c4565b6101b8610228366004611488565b6104e7565b604051601281526020016101c4565b6101b861024a366004611460565b61050a565b6101b861025d366004611507565b610524565b610275610270366004611460565b610570565b005b61027561028536600461155d565b6105ad565b6102756102983660046115b7565b610679565b6102756102ab3660046115f6565b610812565b6102756102be36600461163e565b6109af565b61020c6102d136600461155d565b6001600160a01b03165f9081526020819052604090205490565b610275610b2c565b61027561030136600461155d565b610b3f565b6005546040516001600160a01b0390911681526020016101c4565b6101d5610c08565b6101b8610337366004611460565b610c17565b6101b861034a36600461169e565b610c24565b6101b861035d366004611507565b610c70565b61020c60c881565b6101b8610378366004611488565b610cb1565b61020c61038b366004611708565b610ccc565b6101b861039e36600461155d565b6001600160a01b03165f9081526007602052604090205460ff1690565b6102756103c936600461155d565b610cf6565b5f6001600160e01b0319821663b0202a1160e01b14806103fe57506001600160e01b031982166336372b0760e01b145b8061041957506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606003805461042e90611739565b80601f016020809104026020016040519081016040528092919081815260200182805461045a90611739565b80156104a55780601f1061047c576101008083540402835291602001916104a5565b820191905f5260205f20905b81548152906001019060200180831161048857829003601f168201915b5050505050905090565b5f336104bc818585610d33565b5060019392505050565b5f6104e0838360405180602001604052805f815250610d40565b9392505050565b5f336104f4858285610d6e565b6104ff858585610dd1565b506001949350505050565b5f6104e0838360405180602001604052805f815250610e2e565b5f610565858585858080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250610d4092505050565b90505b949350505050565b610578610e7c565b6001600160a01b03821661059f5760405163d92e233d60e01b815260040160405180910390fd5b6105a98282610ea9565b5050565b6105b5610e7c565b6001600160a01b0381166105dc5760405163d92e233d60e01b815260040160405180910390fd5b6001600160a01b0381165f9081526007602052604090205460ff166106245760405163fc78247960e01b81526001600160a01b03821660048201526024015b60405180910390fd5b6001600160a01b0381165f818152600760209081526040808320805460ff19169055519182527fc0a52010de04a4a5a920bfbaa006102b1014b44a1e1f7315f03903cbcf5318ee91015b60405180910390a250565b610681610e7c565b5f8190036106a25760405163521299a960e01b815260040160405180910390fd5b5f5b8181101561080d575f8383838181106106bf576106bf611771565b90506020020160208101906106d4919061155d565b6001600160a01b0316036106fb5760405163d92e233d60e01b815260040160405180910390fd5b60075f84848481811061071057610710611771565b9050602002016020810190610725919061155d565b6001600160a01b0316815260208101919091526040015f205460ff1661080557600160075f85858581811061075c5761075c611771565b9050602002016020810190610771919061155d565b6001600160a01b0316815260208101919091526040015f20805460ff19169115159190911790558282828181106107aa576107aa611771565b90506020020160208101906107bf919061155d565b6001600160a01b03167fc0a52010de04a4a5a920bfbaa006102b1014b44a1e1f7315f03903cbcf5318ee60016040516107fc911515815260200190565b60405180910390a25b6001016106a4565b505050565b61081a610e7c565b5f82900361083b5760405163521299a960e01b815260040160405180910390fd5b60c88211156108675760405163395b8fad60e11b81526004810183905260c8602482015260440161061b565b5f8267ffffffffffffffff81111561088157610881611785565b6040519080825280602002602001820160405280156108aa578160200160208202803683370190505b5090505f6108b884846117ad565b90505f5b8481101561096a575f8686838181106108d7576108d7611771565b90506020020160208101906108ec919061155d565b6001600160a01b0316036109135760405163d92e233d60e01b815260040160405180910390fd5b8383828151811061092657610926611771565b60200260200101818152505061096286868381811061094757610947611771565b905060200201602081019061095c919061155d565b85610ea9565b6001016108bc565b507f77d3d247e69b715cc61a4c2b2b082447a0021a76cf636c6eda2e35ecfb95cfbb858584846040516109a0949392919061180a565b60405180910390a15050505050565b6109b7610e7c565b5f8390036109d85760405163521299a960e01b815260040160405180910390fd5b8281146109f85760405163512509d360e11b815260040160405180910390fd5b60c8831115610a245760405163395b8fad60e11b81526004810184905260c8602482015260440161061b565b5f805b84811015610af4575f868683818110610a4257610a42611771565b9050602002016020810190610a57919061155d565b6001600160a01b031603610a7e5760405163d92e233d60e01b815260040160405180910390fd5b610ac6868683818110610a9357610a93611771565b9050602002016020810190610aa8919061155d565b858584818110610aba57610aba611771565b90506020020135610ea9565b838382818110610ad857610ad8611771565b9050602002013582610aea919061186c565b9150600101610a27565b507f77d3d247e69b715cc61a4c2b2b082447a0021a76cf636c6eda2e35ecfb95cfbb85858585856040516109a095949392919061187f565b610b34610e7c565b610b3d5f610edd565b565b610b47610e7c565b6001600160a01b038116610b6e5760405163d92e233d60e01b815260040160405180910390fd5b6001600160a01b0381165f9081526007602052604090205460ff1615610bb2576040516327951b3f60e11b81526001600160a01b038216600482015260240161061b565b6001600160a01b0381165f81815260076020908152604091829020805460ff1916600190811790915591519182527fc0a52010de04a4a5a920bfbaa006102b1014b44a1e1f7315f03903cbcf5318ee910161066e565b60606004805461042e90611739565b5f336104bc818585610dd1565b5f610c6686868686868080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250610f2e92505050565b9695505050505050565b5f610565858585858080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92019190915250610e2e92505050565b5f61056884848460405180602001604052805f815250610f2e565b6001600160a01b039182165f90815260016020908152604080832093909416825291909152205490565b610cfe610e7c565b6001600160a01b038116610d2757604051631e4fbdf760e01b81525f600482015260240161061b565b610d3081610edd565b50565b61080d8383836001610f5d565b5f610d4961102f565b610d538484610c17565b50610d613333868686611059565b5060016104e06001600655565b5f610d798484610ccc565b90505f198114610dcb5781811015610dbd57604051637dc7a0d960e11b81526001600160a01b0384166004820152602481018290526044810183905260640161061b565b610dcb84848484035f610f5d565b50505050565b6001600160a01b038316610dfa57604051634b637e8f60e11b81525f600482015260240161061b565b6001600160a01b038216610e235760405163ec442f0560e01b81525f600482015260240161061b565b61080d83838361112c565b5f610e3761102f565b610e4184846104af565b50610e4e338585856111e7565b5f610e593386610ccc565b90508015610e6d57610e6b855f6104af565b505b60019150506104e06001600655565b6005546001600160a01b03163314610b3d5760405163118cdaa760e01b815233600482015260240161061b565b6001600160a01b038216610ed25760405163ec442f0560e01b81525f600482015260240161061b565b6105a95f838361112c565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b5f610f3761102f565b610f428585856104e7565b50610f503386868686611059565b5060016105686001600655565b6001600160a01b038416610f865760405163e602df0560e01b81525f600482015260240161061b565b6001600160a01b038316610faf57604051634a1406b160e11b81525f600482015260240161061b565b6001600160a01b038085165f9081526001602090815260408083209387168352929052208290558015610dcb57826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161102191815260200190565b60405180910390a350505050565b60026006540361105257604051633ee5aeb560e01b815260040160405180910390fd5b6002600655565b6001600160a01b0383163b1561112557604051632229f29760e21b81526001600160a01b038416906388a7ca5c9061109b9088908890879087906004016118d2565b6020604051808303815f875af19250505080156110d5575060408051601f3d908101601f191682019092526110d291810190611904565b60015b6110f257604051635c38f01d60e11b815260040160405180910390fd5b6001600160e01b03198116632229f29760e21b1461112357604051635c38f01d60e11b815260040160405180910390fd5b505b5050505050565b6001600160a01b0383161580159061115b57506001600160a01b0383165f9081526007602052604090205460ff165b15611184576040516327951b3f60e11b81526001600160a01b038416600482015260240161061b565b6001600160a01b038216158015906111b357506001600160a01b0382165f9081526007602052604090205460ff165b156111dc576040516327951b3f60e11b81526001600160a01b038316600482015260240161061b565b61080d8383836112af565b6001600160a01b0383163b15610dcb576040516307b04a2d60e41b81526001600160a01b03841690637b04a2d0906112279087908690869060040161191f565b6020604051808303815f875af1925050508015611261575060408051601f3d908101601f1916820190925261125e91810190611904565b60015b61127e576040516327fb397b60e21b815260040160405180910390fd5b6001600160e01b031981166307b04a2d60e41b14611125576040516327fb397b60e21b815260040160405180910390fd5b6001600160a01b0383166112d9578060025f8282546112ce919061186c565b909155506113499050565b6001600160a01b0383165f908152602081905260409020548181101561132b5760405163391434e360e21b81526001600160a01b0385166004820152602481018290526044810183905260640161061b565b6001600160a01b0384165f9081526020819052604090209082900390555b6001600160a01b03821661136557600280548290039055611383565b6001600160a01b0382165f9081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516113c891815260200190565b60405180910390a3505050565b6001600160e01b031981168114610d30575f5ffd5b5f602082840312156113fa575f5ffd5b81356104e0816113d5565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b602081525f6104e06020830184611405565b80356001600160a01b038116811461145b575f5ffd5b919050565b5f5f60408385031215611471575f5ffd5b61147a83611445565b946020939093013593505050565b5f5f5f6060848603121561149a575f5ffd5b6114a384611445565b92506114b160208501611445565b929592945050506040919091013590565b5f5f83601f8401126114d2575f5ffd5b50813567ffffffffffffffff8111156114e9575f5ffd5b602083019150836020828501011115611500575f5ffd5b9250929050565b5f5f5f5f6060858703121561151a575f5ffd5b61152385611445565b935060208501359250604085013567ffffffffffffffff811115611545575f5ffd5b611551878288016114c2565b95989497509550505050565b5f6020828403121561156d575f5ffd5b6104e082611445565b5f5f83601f840112611586575f5ffd5b50813567ffffffffffffffff81111561159d575f5ffd5b6020830191508360208260051b8501011115611500575f5ffd5b5f5f602083850312156115c8575f5ffd5b823567ffffffffffffffff8111156115de575f5ffd5b6115ea85828601611576565b90969095509350505050565b5f5f5f60408486031215611608575f5ffd5b833567ffffffffffffffff81111561161e575f5ffd5b61162a86828701611576565b909790965060209590950135949350505050565b5f5f5f5f60408587031215611651575f5ffd5b843567ffffffffffffffff811115611667575f5ffd5b61167387828801611576565b909550935050602085013567ffffffffffffffff811115611692575f5ffd5b61155187828801611576565b5f5f5f5f5f608086880312156116b2575f5ffd5b6116bb86611445565b94506116c960208701611445565b935060408601359250606086013567ffffffffffffffff8111156116eb575f5ffd5b6116f7888289016114c2565b969995985093965092949392505050565b5f5f60408385031215611719575f5ffd5b61172283611445565b915061173060208401611445565b90509250929050565b600181811c9082168061174d57607f821691505b60208210810361176b57634e487b7160e01b5f52602260045260245ffd5b50919050565b634e487b7160e01b5f52603260045260245ffd5b634e487b7160e01b5f52604160045260245ffd5b634e487b7160e01b5f52601160045260245ffd5b808202811582820484141761041957610419611799565b8183526020830192505f815f5b84811015611800576001600160a01b036117ea83611445565b16865260209586019591909101906001016117d1565b5093949350505050565b606081525f61181d6060830186886117c4565b82810360208401528085518083526020830191506020870192505f5b81811015611857578351835260209384019390920191600101611839565b50506040939093019390935250949350505050565b8082018082111561041957610419611799565b606081525f6118926060830187896117c4565b82810360208401528481526001600160fb1b038511156118b0575f5ffd5b8460051b80876020840137604093909301939093525001602001949350505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190525f90610c6690830184611405565b5f60208284031215611914575f5ffd5b81516104e0816113d5565b60018060a01b0384168152826020820152606060408201525f610565606083018461140556fea2646970667358221220acf62efd56f7a22ddfa5067e0d76a4295aed05ba727af859cf624f0d25349d3f64736f6c63430008220033'

export const BKC_TOKEN_SOURCE = "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport \"@openzeppelin/contracts/token/ERC20/ERC20.sol\";\nimport \"@openzeppelin/contracts/token/ERC20/IERC20.sol\";\nimport \"@openzeppelin/contracts/access/Ownable.sol\";\nimport \"@openzeppelin/contracts/utils/ReentrancyGuard.sol\";\nimport \"@openzeppelin/contracts/utils/introspection/ERC165.sol\";\nimport \"@openzeppelin/contracts/utils/introspection/IERC165.sol\";\nimport \"@openzeppelin/contracts/interfaces/IERC1363.sol\";\nimport \"@openzeppelin/contracts/interfaces/IERC1363Receiver.sol\";\nimport \"@openzeppelin/contracts/interfaces/IERC1363Spender.sol\";\n\n/**\n * @title BKCERC1363Token\n * @dev 支持冻结账户、批量铸造的 ERC1363 代币合约（OZ v5.1+）\n *\n * 修复记录：\n * 1. ERC1363 回调函数添加 nonReentrant 防重入\n * 2. approveAndCall 回调后清零剩余授权\n * 3. 改用 OZ v5.1+ 标准接口，移除本地手写 interface\n * 4. supportsInterface 补充 IERC20 声明\n */\ncontract BKCERC1363Token is ERC20, Ownable, ERC165, ReentrancyGuard, IERC1363 {\n    // ========== 错误定义 ==========\n\n    error AccountFrozen(address account);\n    error AccountNotFrozen(address account);\n    error ZeroAddress();\n    error ArrayLengthMismatch();\n    error EmptyArray();\n    error ExceedsMaxBatchSize(uint256 provided, uint256 max);\n    error NotERC1363Receiver();\n    error NotERC1363Spender();\n\n    // ========== 事件 ==========\n\n    event AccountFreeze(address indexed account, bool frozen);\n    event BatchMint(\n        address[] recipients,\n        uint256[] amounts,\n        uint256 totalMinted\n    );\n\n    // ========== 状态变量 ==========\n\n    mapping(address => bool) private _frozen;\n    uint256 public constant MAX_BATCH_SIZE = 200;\n\n    // ========== 构造函数 ==========\n\n    constructor(\n        string memory name,\n        string memory symbol,\n        uint256 initialSupply,\n        address owner\n    ) ERC20(name, symbol) Ownable(owner) {\n        if (owner == address(0)) revert ZeroAddress();\n        if (initialSupply > 0) {\n            _mint(owner, initialSupply * 10 ** decimals());\n        }\n    }\n\n    // ========== ERC165 ==========\n\n    /**\n     * @notice 声明支持的接口\n     * fix: 补充 IERC20 interfaceId 声明\n     */\n    function supportsInterface(\n        bytes4 interfaceId\n    ) public view override(ERC165, IERC165) returns (bool) {\n        return\n            interfaceId == type(IERC1363).interfaceId ||\n            interfaceId == type(IERC20).interfaceId ||\n            super.supportsInterface(interfaceId);\n    }\n\n    // ========== 冻结功能 ==========\n\n    /// @notice 冻结指定账户\n    function freeze(address account) external onlyOwner {\n        if (account == address(0)) revert ZeroAddress();\n        if (_frozen[account]) revert AccountFrozen(account);\n        _frozen[account] = true;\n        emit AccountFreeze(account, true);\n    }\n\n    /// @notice 解冻指定账户\n    function unfreeze(address account) external onlyOwner {\n        if (account == address(0)) revert ZeroAddress();\n        if (!_frozen[account]) revert AccountNotFrozen(account);\n        _frozen[account] = false;\n        emit AccountFreeze(account, false);\n    }\n\n    /// @notice 批量冻结账户\n    function batchFreeze(address[] calldata accounts) external onlyOwner {\n        if (accounts.length == 0) revert EmptyArray();\n        for (uint256 i = 0; i < accounts.length; i++) {\n            if (accounts[i] == address(0)) revert ZeroAddress();\n            if (!_frozen[accounts[i]]) {\n                _frozen[accounts[i]] = true;\n                emit AccountFreeze(accounts[i], true);\n            }\n        }\n    }\n\n    /// @notice 查询账户是否被冻结\n    function isFrozen(address account) external view returns (bool) {\n        return _frozen[account];\n    }\n\n    // ========== 批量铸造 ==========\n\n    /// @notice 批量铸造，每个地址指定数量（原始单位，需自行带精度）\n    function batchMint(\n        address[] calldata recipients,\n        uint256[] calldata amounts\n    ) external onlyOwner {\n        if (recipients.length == 0) revert EmptyArray();\n        if (recipients.length != amounts.length) revert ArrayLengthMismatch();\n        if (recipients.length > MAX_BATCH_SIZE)\n            revert ExceedsMaxBatchSize(recipients.length, MAX_BATCH_SIZE);\n\n        uint256 totalMinted;\n        for (uint256 i = 0; i < recipients.length; i++) {\n            if (recipients[i] == address(0)) revert ZeroAddress();\n            _mint(recipients[i], amounts[i]);\n            totalMinted += amounts[i];\n        }\n\n        emit BatchMint(recipients, amounts, totalMinted);\n    }\n\n    /// @notice 批量铸造同等数量给多个地址\n    function batchMintEqual(\n        address[] calldata recipients,\n        uint256 amount\n    ) external onlyOwner {\n        if (recipients.length == 0) revert EmptyArray();\n        if (recipients.length > MAX_BATCH_SIZE)\n            revert ExceedsMaxBatchSize(recipients.length, MAX_BATCH_SIZE);\n\n        uint256[] memory amounts = new uint256[](recipients.length);\n        uint256 totalMinted = amount * recipients.length;\n\n        for (uint256 i = 0; i < recipients.length; i++) {\n            if (recipients[i] == address(0)) revert ZeroAddress();\n            amounts[i] = amount;\n            _mint(recipients[i], amount);\n        }\n\n        emit BatchMint(recipients, amounts, totalMinted);\n    }\n\n    /// @notice 单次铸造\n    function mint(address to, uint256 amount) external onlyOwner {\n        if (to == address(0)) revert ZeroAddress();\n        _mint(to, amount);\n    }\n\n    // ========== 转账拦截（冻结检查） ==========\n\n    function _update(\n        address from,\n        address to,\n        uint256 value\n    ) internal override {\n        if (from != address(0) && _frozen[from]) revert AccountFrozen(from);\n        if (to != address(0) && _frozen[to]) revert AccountFrozen(to);\n        super._update(from, to, value);\n    }\n\n    // ========== ERC1363 核心实现 ==========\n\n    /// @inheritdoc IERC1363\n    function transferAndCall(\n        address to,\n        uint256 value\n    ) external override returns (bool) {\n        return _transferAndCall(to, value, \"\");\n    }\n\n    /**\n     * IERC1363\n     * fix: 添加 nonReentrant 防止回调重入\n     */\n    function transferAndCall(\n        address to,\n        uint256 value,\n        bytes calldata data\n    ) external override returns (bool) {\n        return _transferAndCall(to, value, data);\n    }\n\n    /**\n     * @dev 内部实现，避免 `this` 调用产生的gas开销\n     */\n    function _transferAndCall(\n        address to,\n        uint256 value,\n        bytes memory data\n    ) internal nonReentrant returns (bool) {\n        transfer(to, value);\n        _checkOnTransferReceived(msg.sender, msg.sender, to, value, data);\n        return true;\n    }\n\n    /// @inheritdoc IERC1363\n    function transferFromAndCall(\n        address from,\n        address to,\n        uint256 value\n    ) external override returns (bool) {\n        return _transferFromAndCall(from, to, value, \"\");\n    }\n\n    /**\n     * IERC1363\n     * fix: 添加 nonReentrant 防止回调重入\n     */\n    function transferFromAndCall(\n        address from,\n        address to,\n        uint256 value,\n        bytes calldata data\n    ) external override returns (bool) {\n        return _transferFromAndCall(from, to, value, data);\n    }\n\n    /**\n     * @dev 内部实现，避免 `this` 调用产生的gas开销\n     */\n    function _transferFromAndCall(\n        address from,\n        address to,\n        uint256 value,\n        bytes memory data\n    ) internal nonReentrant returns (bool) {\n        transferFrom(from, to, value);\n        _checkOnTransferReceived(msg.sender, from, to, value, data);\n        return true;\n    }\n\n    /// @inheritdoc IERC1363\n    function approveAndCall(\n        address spender,\n        uint256 value\n    ) external override returns (bool) {\n        return _approveAndCall(spender, value, \"\");\n    }\n\n    /**\n     * IERC1363\n     * notice: 添加 nonReentrant 防止回调重入\n     * fix2: 回调结束后清零剩余授权，防止 allowance 残留被滥用\n     */\n    function approveAndCall(\n        address spender,\n        uint256 value,\n        bytes calldata data\n    ) external override returns (bool) {\n        return _approveAndCall(spender, value, data);\n    }\n\n    /**\n     * @dev 内部实现，避免 `this` 调用产生的gas开销\n     */\n    function _approveAndCall(\n        address spender,\n        uint256 value,\n        bytes memory data\n    ) internal nonReentrant returns (bool) {\n        approve(spender, value);\n        _checkOnApprovalReceived(msg.sender, spender, value, data);\n\n        // 清零剩余授权\n        uint256 remaining = allowance(msg.sender, spender);\n        if (remaining > 0) {\n            approve(spender, 0);\n        }\n\n        return true;\n    }\n\n    // ========== 内部回调检查 ==========\n\n    function _checkOnTransferReceived(\n        address operator,\n        address from,\n        address to,\n        uint256 value,\n        bytes memory data\n    ) internal {\n        if (to.code.length == 0) return;\n        try\n            IERC1363Receiver(to).onTransferReceived(operator, from, value, data)\n        returns (bytes4 retval) {\n            if (retval != IERC1363Receiver.onTransferReceived.selector)\n                revert NotERC1363Receiver();\n        } catch {\n            revert NotERC1363Receiver();\n        }\n    }\n\n    function _checkOnApprovalReceived(\n        address owner,\n        address spender,\n        uint256 value,\n        bytes memory data\n    ) internal {\n        if (spender.code.length == 0) return;\n        try\n            IERC1363Spender(spender).onApprovalReceived(owner, value, data)\n        returns (bytes4 retval) {\n            if (retval != IERC1363Spender.onApprovalReceived.selector)\n                revert NotERC1363Spender();\n        } catch {\n            revert NotERC1363Spender();\n        }\n    }\n}\n"
