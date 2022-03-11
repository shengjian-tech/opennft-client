import base58 from 'bs58';

export function XchainAddrToEvm(addr) {
    var result = ''
    try {
        //    var addr;
        //    var addrType;
        // 判断是否是合约账号;判断合约账户地址仅支持 XC11111111111@xuper, xuper后缀，go-sdk有相同问题。
        if  (determineContractAccount(addr)){
            result = contractAccountToEVMAddress(addr)
        } else if (determineContractName(addr)) {
            result = contractNameToEVMAddress(addr)
        } else {
            result =  xchainAKToEVMAddress(addr)
        }
        return result
    }catch (err) {
        console.log(err)
    }
    
}
// 判断合约账户地址仅支持 XC11111111111@xuper, xuper后缀，go-sdk有相同问题。
function determineContractAccount(xchainAddr) {
    if (isAccount(xchainAddr) != 1) {
        return false;
    }
    return xchainAddr.indexOf("@xuper") != -1;
}

const accountPrefix = "XC"
function isAccount(name) {
    if (name == '') {
        return -1;
    }
    if (name.indexOf(accountPrefix) != 0) {
        return 0;
    }
    var prefix = name.split("@")[0]
    prefix = prefix.substr(accountPrefix.length)
    if (!validRawAccount(prefix)) {
        return 0;
    }
    return 1;
}

const accountSize = 16
function validRawAccount(accountName) {
    if (accountName == "") {
        return false
    }
    if (accountName.length != accountSize) {
        return false
    }
    for (var i = 0 ; i < accountSize; i++) {
        if (accountName[i] >= '0' && accountName[i] <= '9') {
            continue
        } else {
            return false
        }
    } 
    return true
}
const contractAccountPrefixs = "1112"
const Word160Length = 20
function contractAccountToEVMAddress(contractAccount) {
    var contractAccountValid = contractAccount.slice(2,18);
    var str = contractAccountPrefixs.concat(contractAccountValid)
    if (str.length != Word160Length) {
        throw new Error("slice passed as address shou have 20 byte length");
    }
    return Buffer.from(str).toString("hex").toUpperCase()
}

const contractNameMaxSize = 16
const contractNameMinSize = 4
const contractNameRegex = /^[a-zA-Z_]{1}[0-9a-zA-Z_.]+[0-9a-zA-Z_]$/

function determineContractName(xchainAddr) {
    var contractSize = xchainAddr.length
	if (contractSize > contractNameMaxSize || contractSize < contractNameMinSize) {
        return false
	}
	if (!contractNameRegex.test(xchainAddr)) {
        return false
	}
	return true
}

const evmAddressFiller = "-"
const contractNamePrefixs = "1111"
function contractNameToEVMAddress(contractName) {
    var contractNameLength = contractName.length
	var prefixStr = ''
	for (var i = 0; i < Word160Length-contractNameLength-4; i++) {
		prefixStr += evmAddressFiller
	}
	contractName = prefixStr + contractName
	contractName = contractNamePrefixs + contractName

    if (contractName.length != Word160Length) {
        throw new Error("slice passed as address shou have 20 byte length");
    }
    return Buffer.from(contractName).toString("hex").toUpperCase()
}

function xchainAKToEVMAddress(xchainAddr) {
    var rawAddr =  base58.decode(xchainAddr)
    if (rawAddr.length < 21){
		throw new Error("bad address")
	}
    rawAddr = rawAddr.slice(1, 21)
    return Buffer.from(rawAddr, "").toString("hex").toUpperCase()
}