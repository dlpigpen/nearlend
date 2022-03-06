export NEAR_ENV=testnet
export OWNER_ID=nthellious.testnet
export ORACLE_ID=nthellious.testnet
export ACCOUNT_ID=nthellious.testnet
export ACCOUNT_ID_2=tn666.testnet
export ACCOUNT_ID_3=tn777.testnet
export CONTRACT_ID=nel.nthellious.testnet
export REF_TOKEN_ID=ref.fakes.testnet

export WETH_TOKEN_ID=weth.fakes.testnet
export DAI_TOKEN_ID=dai.fakes.testnet
export USDT_TOKEN_ID=usdt.fakes.testnet
export USDC_TOKEN_ID=usdc.testnet

export AURORAX_TOKEN_ID=aurorax.testnet
export AURORAX_TOKEN_ID=auroraf.token-factory.tokenhub.testnet
export NEL_TOKEN_ID=neltest.token-factory.tokenhub.testnet

export WNEAR_TOKEN_ID=wrap.testnet
export ONE_YOCTO=0.000000000000000000000001
export GAS=200000000000000

near delete $CONTRACT_ID $ACCOUNT_ID

near create-account $CONTRACT_ID --masterAccount $ACCOUNT_ID --initialBalance 10

near deploy $CONTRACT_ID --accountId $ACCOUNT_ID --wasmFile ./res/Nearlend.wasm

near call $CONTRACT_ID new '{"config" : {"oracle_account_id": "'$ACCOUNT_ID'", "owner_id": "'$ACCOUNT_ID'", "booster_token_id": "'$REF_TOKEN_ID'", "booster_decimals": 24}}' --accountId $ACCOUNT_ID

near call $CONTRACT_ID --accountId=test2.hoangnh_xda.testnet --gas=$GAS --amount=0.1 storage_deposit '{
  "account_id": "test2.hoangnh_xda.testnet",
  "registration_only": true
}'


near call $CONTRACT_ID --accountId=$ACCOUNT_ID storage_balance_of '{
  "account_id": "nearlend.lam-test1.testnet"
}'

#CHECK TOKEN IS DEPOSITED
near view $NEL_TOKEN_ID --accountId=$ACCOUNT_ID storage_balance_of '{
  "account_id": "'$ACCOUNT_ID_3'"
}'

// near call $CONTRACT_ID addAccount '{"account_id": "'$ACCOUNT_ID'"}' --accountId $ACCOUNT_ID

near call $CONTRACT_ID get_account '{"account_id": "'$ACCOUNT_ID'"}' --accountId $ACCOUNT_ID

near call $CONTRACT_ID get_accounts_paged '{"from_index": 0, "limit": 100}' --accountId $ACCOUNT_ID

near call $CONTRACT_ID get_assets_paged '{"from_index": 0, "limit": 10}' --accountId $ACCOUNT_ID 

near call $CONTRACT_ID get_assets_paged_detailed '{"from_index": 0, "limit": 10}' --accountId $ACCOUNT_ID 

near call $CONTRACT_ID get_asset '{"token_id": "'$AURORAX_TOKEN_ID'"}' --accountId $ACCOUNT_ID 

near view $AURORAX_TOKEN_ID ft_metadata
near view $WNEAR_TOKEN_ID ft_metadata
near view $USDT_TOKEN_ID ft_metadata
near view $DAI_TOKEN_ID ft_metadata
near view $WETH_TOKEN_ID ft_metadata
near view $REF_TOKEN_ID ft_metadata
near view $NEL_TOKEN_ID ft_metadata

near view $AURORAX_TOKEN_ID ft_balance_of '{"account_id": "'$ACCOUNT_ID'"}'
near view $NEL_TOKEN_ID ft_balance_of '{"account_id": "'$ACCOUNT_ID'"}'

near view $AURORAX_TOKEN_ID_2 ft_balance_of '{"account_id": "'$ACCOUNT_ID_3'"}'

near view $NEL_TOKEN_ID storage_balance_bounds

#REGISTOR newest TOKEN for USER_ACCOUNT #IF USER_ACCOUNT NEVER EVER HAVE IT YET !
near call $CONTRACT_ID storage_deposit '{"account_id": "'$ACCOUNT_ID_2'"}' --accountId $ACCOUNT_ID --deposit 0.00125

#SEND TOKEN DIRECTLY TO RECEIVER
near call $AURORAX_TOKEN_ID_2 ft_transfer '{"receiver_id": "'$ACCOUNT_ID_3'", "amount": "2000000000"}' --accountId $ACCOUNT_ID --amount $ONE_YOCTO

near call $CONTRACT_ID --accountId=$OWNER_ID add_asset '{
  "token_id": "'$AURORAX_TOKEN_ID'",
  "asset_config": {
    "reserve_ratio": 2500,
    "target_utilization": 8000,
    "target_utilization_rate": "1000000000008319516250272147",
    "max_utilization_rate": "1000000000039724853136740579",
    "volatility_ratio": 2000,
    "extra_decimals": 24,
    "can_deposit": true,
    "can_withdraw": true,
    "can_use_as_collateral": true,
    "can_borrow": true
  }
}' --amount=$ONE_YOCTO --gas=$GAS


near call $CONTRACT_ID --accountId=$OWNER_ID add_asset '{
  "token_id": "'$NEL_TOKEN_ID'",
  "asset_config": {
    "reserve_ratio": 2500,
    "target_utilization": 8000,
    "target_utilization_rate": "1000000000008319516250272147",
    "max_utilization_rate": "1000000000039724853136740579",
    "volatility_ratio": 2000,
    "extra_decimals": 24,
    "can_deposit": true,
    "can_withdraw": true,
    "can_use_as_collateral": true,
    "can_borrow": true
  }
}' --amount=$ONE_YOCTO --gas=$GAS


near call $CONTRACT_ID --accountId=$OWNER_ID add_asset '{
  "token_id": "'$REF_TOKEN_ID'",
  "asset_config": {
    "reserve_ratio": 2500,
    "target_utilization": 8000,
    "target_utilization_rate": "1000000000008319516250272147",
    "max_utilization_rate": "1000000000039724853136740579",
    "volatility_ratio": 2000,
    "extra_decimals": 18,
    "can_deposit": true,
    "can_withdraw": true,
    "can_use_as_collateral": true,
    "can_borrow": true
  }
}' --amount=$ONE_YOCTO --gas=$GAS


near call $CONTRACT_ID --accountId=$OWNER_ID add_asset '{
  "token_id": "'$WETH_TOKEN_ID'",
  "asset_config": {
    "reserve_ratio": 2500,
    "target_utilization": 8000,
    "target_utilization_rate": "1000000000008319516250272147",
    "max_utilization_rate": "1000000000039724853136740579",
    "volatility_ratio": 2000,
    "extra_decimals": 18,
    "can_deposit": true,
    "can_withdraw": true,
    "can_use_as_collateral": true,
    "can_borrow": true
  }
}' --amount=$ONE_YOCTO --gas=$GAS


near call $AURORAX_TOKEN_ID --accountId=$ACCOUNT_ID --gas=$GAS --amount=$ONE_YOCTO ft_transfer_call '{
  "receiver_id": "'$CONTRACT_ID'",
  "amount": "1",
  "msg": "{\"Execute\": {\"actions\": [{\"Withdraw\": {\"token_id\": \"'$AURORAX_TOKEN_ID'\", \"amount\": \"3000000000000000000000000\"}}]}}"
}'

near call $AURORAX_TOKEN_ID --accountId=$ACCOUNT_ID --gas=$GAS --amount=$ONE_YOCTO ft_transfer_call '{
  "receiver_id": "'$CONTRACT_ID'",
  "amount": "1",
  "msg": "{\"Execute\": {\"actions\": [{\"Borrow\": {\"token_id\": \"'$AURORAX_TOKEN_ID'\", \"amount\": \"3000000000000000000000000\"}}]}}"
}'

near call $AURORAX_TOKEN_ID --accountId=$ACCOUNT_ID --gas=$GAS --amount=$ONE_YOCTO ft_transfer_call '{
  "receiver_id": "'$CONTRACT_ID'",
  "amount": "1000000000000000000000000000000000",
  "msg": ""
}'


near call $CONTRACT_ID --accountId=$ACCOUNT_ID --gas=$GAS --amount=$ONE_YOCTO execute '{
  "actions": [
    {
      "Withdraw": {
        "token_id": "'$AURORAX_TOKEN_ID'",
        "amount": "1000000000000000000000000000000000"
      }
    }
  ]
}'