import { NextSeo } from 'next-seo';
import React, { useState, useEffect} from 'react';
import type { NextPageWithLayout } from '@/types';
import DashboardLayout from '@/layouts/dashboard/_dashboard_2';
import Base from '@/components/ui/base2';
import { useRouter } from 'next/router';
import routes from '@/config/routes';
import Image from '@/components/ui/image';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import {
    Transaction,
    WalletAdapterNetwork,
    WalletNotConnectedError,
  } from '@demox-labs/aleo-wallet-adapter-base';

function encode_name(name) {
    const dictionary = new Map([
      ["a", 1],
      ["b", 2],
      ["c", 3],
      ["d", 4],
      ["e", 5],
      ["f", 6],
      ["g", 7],
      ["h", 8],
      ["i", 9],
      ["j", 10],
      ["k", 11],
      ["l", 12],
      ["m", 13],
      ["n", 14],
      ["o", 15],
      ["p", 16],
      ["q", 17],
      ["r", 18],
      ["s", 19],
      ["t", 20],
      ["u", 21],
      ["v", 22],
      ["w", 23],
      ["x", 24],
      ["y", 25],
      ["z", 26],
      ["0", 27],
      ["1", 28],
      ["2", 29],
      ["3", 30],
      ["4", 31],
      ["5", 32],
      ["6", 33],
      ["7", 34],
      ["8", 35],
      ["9", 36],
      ["_", 37],
    ]);
    let encoded_name = "";
    for (let j = name.length-1; j >= 0 ; j--) {
      let text = (dictionary.get(name[j])).toString(2);
      let len = text.length;
      for (let i = 0; i < 6-len; i++) {
        text = "0" + text;
      }
      encoded_name = text + encoded_name
    }
    return BigInt("0b" + encoded_name).toString();
  }
  function decode_name(encoded_name) {
    const dictionary = new Map([
      [1, "a"],
      [2,"b"],
      [3,"c"],
      [4,"d"],
      [5,"e"],
      [6,"f"],
      [7,"g"],
      [8,"h"],
      [9,"i"],
      [10,"j"],
      [11,"k"],
      [12,"l"],
      [13,"m"],
      [14,"n"],
      [15,"o"],
      [16,"p"],
      [17,"q"],
      [18,"r"],
      [19,"s"],
      [20,"t"],
      [21,"u"],
      [22,"v"],
      [23,"w"],
      [24,"x"],
      [25,"y"],
      [26,"z"],
      [27,"0"],
      [28,"1"],
      [29,"2"],
      [30,"3"],
      [31,"4"],
      [32,"5"],
      [33,"6"],
      [34,"7"],
      [35,"8"],
      [36,"9"],
      [37,"_"],
    ]);
    let name = '';
    let temp1 = encoded_name.replace('u128','');
    let temp2 = parseInt(temp1);
    let temp3 = temp2.toString(2);
    let temp4 = '0'.repeat((128 - temp3.length)) + temp3;
    for (let i = temp4.length; i >= 0; i=i-6) {
        let char = parseInt(temp4.substring(i-6, i),2);
        if (char === 0){
            break;
        }
        name = dictionary.get(char) + name;
    }
    return name;
  }

function copy(id) {
    // Get the text field
    var copyText = document.getElementById(id);
     // Copy the text inside the text field
    navigator.clipboard.writeText(copyText?.innerHTML);
  
  }


const ProfileTransfer: NextPageWithLayout = () => {
    const router = useRouter();
    const dataFetch2 = async () => {
      const response = await (
        await fetch(
          "https://vm.aleo.org/api/testnet3/program/zns_registry_v1_4.aleo/mapping/primary_name/" + publicKey,
          {headers: {'Content-Type': 'application/json'}, method: "GET"}
        )
      ).json();
      if (response === null) {
          return null;
      } else {
          let json = JSON.parse(response.replaceAll(/[a-zA-Z0-9_]+/g,(current:string) => {return "\"" + current + "\""}));
          return json;
      }
    };
    const dataFetch = async (name:string) => {
        let encoded_name : string = encode_name(name.replace('.zexe',''))
        const response = await (
          await fetch(
            "https://vm.aleo.org/api/testnet3/program/zns_registry_v1_4.aleo/mapping/domains/%7Btld:6837765u128,name:" + encoded_name + "u128,subname:0u128%7D",
            {headers: {'Content-Type': 'application/json'}, method: "GET"}
          )
        ).json();
        if (response === null) {
            return null;
        } else {
            let json = JSON.parse(response.replaceAll(/[a-zA-Z0-9_]+/g,(current:string) => {return "\"" + current + "\""}));
            return json;
        }
      };
    
    const transferPrivate = async() => {

        if (!publicKey) throw new WalletNotConnectedError();

        let reciever = document.getElementById('transfer-input-private').value;
    
        const inputs = [reciever, deed];
        let programId = 'zns_registry_v1_4.aleo';
        let functionName = (ownerHidden ? 'transfer_private_to_private' : 'transfer_public_to_private')
        let fee = 5;
    
        const aleoTransaction = Transaction.createTransaction(
          publicKey,
          WalletAdapterNetwork.Testnet,
          programId,
          functionName,
          inputs,
          fee!
        );
        let txId;
        try{txId = await (wallet?.adapter as LeoWalletAdapter).requestTransaction(aleoTransaction);} catch(e) {
        }
      };

    const transferPublic = async() => {
        if (!publicKey) throw new WalletNotConnectedError();
        let reciever = document.getElementById('transfer-input-public').value;
        const inputs = [reciever, deed];
        let programId = 'zns_registry_v1_4.aleo';
        let functionName = (ownerHidden ? 'transfer_private_to_public' : 'transfer_public_to_public')
        let fee = 5;
    
        const aleoTransaction = Transaction.createTransaction(
          publicKey,
          WalletAdapterNetwork.Testnet,
          programId,
          functionName,
          inputs,
          fee!
        );
        let txId;
        try{txId = await (wallet?.adapter as LeoWalletAdapter).requestTransaction(aleoTransaction);} catch(e) {
        }
    };
    



    const [currentOwner, setCurrentOwner] = useState("");
    const [currentResolver, setCurrentResolver] = useState("");
    const [currentTld, setCurrentTld] = useState("");
    const [currentRegistrar, setCurrentRegistrar] = useState("");
    const [ownerHidden, setOwnerHidden] = useState(false);
    const [currentName, setCurrentName] = useState("");

    useEffect(() => {
        document.getElementById("transfer-button-public")!.addEventListener("click",transferPublic, false);
        document.getElementById("transfer-button-private")!.addEventListener("click",transferPrivate , false);
        const queryParams = new URLSearchParams(window.location.search);
        let name = queryParams.get("name");
        if(name === null){
            router.push(routes.home)
        }
        
        /* Query API Here */
        else{
            setCurrentName(name);
            dataFetch(name.replace('.aleo','')).then(json => {
                if(json === null){
                    router.push(routes.home)
                } else {    
                setCurrentOwner(json.current_owner);
                setCurrentTld("." + decode_name(json.name.tld));
                setCurrentRegistrar(decode_name(json.registrar)+ ".aleo");
                setCurrentResolver(decode_name(json.resolver)+ ".aleo");
                setOwnerHidden(json.owner_hidden === 'true');}
            });
        }
    },[]);


    const { wallet, publicKey, requestRecords } = useWallet();
    const [isOwner, setIsOwner] = useState(false);
    const [deed, setDeed] = useState('');
    const [primary, setPrimary] = useState('');
    const [isPrimary, setIsPrimary] = useState(false);

    const checkDeed = async () => {
        if (!publicKey) throw new WalletNotConnectedError();
        let records = (await requestRecords!('zns_registry_v1_4.aleo')) || '';
        records = records.filter((rec) => {
            return !rec.spent;
        });
        records = records.filter((rec) => {
            return (rec.data.tld === "6837765u128.private" && rec.data.name === encode_name(currentName.replace('.zexe','')) + "u128.private");
        });
   
        setDeed(deed);
        if (records.length === 0){
            return false;
        } else {
            setDeed(records[0])
            return true;
        }
      };

      useEffect(() => {
        if(publicKey){
            dataFetch2().then(json => {
                if(json !== null){
                    console.log(currentName);
                    console.log(decode_name(json.name.replace('u128','')))
                    if(currentName.replace('.zexe','') === decode_name(json.name.replace('u128',''))){
                        setIsPrimary(true);
                    }
                } 
            });
        }
    },[publicKey, currentName]);

      useEffect(() => {
        if(false){ //Temporary Fix
        checkDeed().then(ownership => {
            console.log(ownership);
            setIsOwner(ownership);
        }).catch((e) => {});   
        }
    },[publicKey]);

    useEffect(() => {
        if(!publicKey){
            setIsOwner(false);
        }
    },[publicKey]);
    return (
        <>
        <NextSeo
            title="Profile"
            description="Profile Transfer"
        />
        <div className="mx-auto relative w-[900px] h-[300px] rounded-lg shadow-card bg-light-dark">
            <div className = "mt-[60px] ml-10 absolute">
                <img src="/aleo-logo-full.png" className = "w-[150px] h-[150px] z[2] object-cover rounded-full">
                </img>
            </div>
            <div className="text-4xl h-[140px] w-[900px] rounded-lg rounded-b-none bg-gradient-to-r from-regal-blue to-cyan-400">
            </div>
            <div className="flex">
                <div className="text-4xl pt-[90px] pr-7 pl-7">
                    {currentName}
                </div>
                <div className = {(ownerHidden ? "flex text-md scale-90 mt-[96px]  rounded-3xl border-2 py-1 px-2 border-white": "flex text-md scale-90 mt-[96px]  rounded-3xl border-2 py-1 px-2 border-white")}> {(ownerHidden ? "Private" : "Public")} </div>
                <div id ="primary-symbol" className = "flex text-md scale-90 mt-[96px] ml-2  rounded-3xl border-2 py-1 px-2 text-green-400 border-green-400" data-IsPrimary={isPrimary}> Primary </div>
            </div>
        </div>
        <Base>
            <div id = "hider" className="absolute z-[3] h-[500px] w-[910px] mt-[-30px] -ml-7 bg-dark bg-opacity-90 text-center text-4xl justify-center flex items-center pointer-events-none" data-IsOwner={isOwner} >Coming Soon!</div>
            <div className="text-2xl pb-5 underline select-none" >Transfer to Public</div>
            <label className="flex w-full items-center justify-between py-4 pt-5 pb-10">
                Recipient
                <input
                id="transfer-input-public"
                className="h-11 w-10/12 appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-md tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-5 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
                data-IsOwner={isOwner}
                disabled={!isOwner}
                />
            </label>
            <button id="transfer-button-public" className="scale-125" data-IsOwner={isOwner}>Transfer</button>
            <div className="text-2xl pb-5 pt-10 underline select-none;">Transfer to Private</div>
            <label className="flex w-full pb-10 items-center justify-between py-4">
                Recipient
                <input
                id="transfer-input-private"
                className="h-11 w-10/12 appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-md tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-5 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
                data-IsOwner={isOwner}
                disabled={!isOwner}
                />
            </label>
            <button id="transfer-button-private" className="scale-125" data-IsOwner={isOwner}>Transfer</button>
            <div className="pt-10"></div>
        </Base>
        </>
    )

};




ProfileTransfer.getLayout = function getLayout(page) {
    return <DashboardLayout>{page}</DashboardLayout>;
  };
 
export default ProfileTransfer