
import { NextSeo } from 'next-seo';
import React, { useState, useEffect} from 'react';
import type { NextPageWithLayout } from '@/types';
import DashboardLayout from '@/layouts/dashboard/_dashboard_2';
import Image from '@/components/ui/image';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import logo from '@/assets/images/zexe5.png';
import { motion } from 'framer-motion';
import Modal from "@/components/popup";
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';

import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@demox-labs/aleo-wallet-adapter-base';
import routes from '@/config/routes';
import { useRouter } from 'next/router';



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

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30
};

const HomePage: NextPageWithLayout = () => {

  const { wallet, publicKey } = useWallet();

  let programId = 'zns_registry_v1_4.aleo';
  let [functionName, setFunctionName] = useState('create_domain_public');
  // let [fee, setFee] = useState<number | undefined>();
  let fee = 3000000;
  let [transactionId, setTransactionId] = useState<string | undefined>();
  let [status, setStatus] = useState<string | undefined>();
  const isMounted = useIsMounted();
  const [datam, setDatam] = useState();
  const [currentName, setCurrentName] = useState("");
  const [currentDomain, setCurrentDomain] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [isCheckedReg, setIsCheckedReg] = useState(false);
  const [isCheckedRes, setIsCheckedRes] = useState(false);
  let [registrar, setRegistrar] = useState('');
  let [resolver, setResolver] = useState('');
  let[isGood, setIsGood] = useState(false);
  let[isBad, setIsBad] = useState(false);
  
  const load_modal = () => {
    setShowModal(true);
  }

  const format1 = (userData : string) => {
    let formatted: string = userData.toLowerCase().replace(/[^(\x61-\x7A||\x30-\x39 || \x5F)]/g, "");
    return formatted
  }

  const format2 = () => {
    const inputBox: HTMLInputElement = document.querySelector("resolver_box")!;
    let formatted: string = inputBox?.value.toLowerCase().replace(/[^(\x61-\x7A||\x30-\x39 || \x5F)]/g, "");
    console.log(formatted) 
  }


  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (transactionId) {
      intervalId = setInterval(() => {
        getTransactionStatus(transactionId!);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [transactionId]);

  useEffect(() => {
    if (status == "Completed" || status =="Finalized"){
      setIsGood(true);
      if(document.getElementById("registering-text") !== null){
        document.getElementById("registering-text").innerHTML = "Registered!";
        if (document.getElementById("checkmark") !== null){
          let element1 = document.getElementById("checkmark");
          element1.classList.add("run-animation-checkmark"); 
        }

        if (document.getElementById("checkmark__check") !== null){
          let element2 = document.getElementById("checkmark__check");
          element2.classList.add("run-animation-checkmark__check"); 
        }

        if (document.getElementById("checkmark__circle") !== null){
          let element3 = document.getElementById("checkmark__circle");
          element3.classList.add("run-animation-checkmark__circle"); 
        }
      }
    }
    if (status == "Failed"){
      setIsBad(true);
      if(document.getElementById("registering-text") !== null){
        document.getElementById("registering-text").innerHTML = "Something went wrong...";
      }
    }
  });

  const handleSubmit = async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    // const inputsArray = inputs.split('\n');
    // const parsedInputs = inputsArray.map((input) => tryParseJSON(input));
    const inputs = ["{tld:6837765u128,name:" + encode_name(currentDomain) +"u128,subname:0u128}",encode_name(registrar) + "u128",encode_name(resolver) + "u128"];


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
      txId = '';
      setStatus("Wallet Error")
      setIsBad(true);
      if(document.getElementById("registering-text") !== null){
        document.getElementById("registering-text").innerHTML = "Something went wrong...";
      }
    }
    setTransactionId(txId);
  };

  const getTransactionStatus = async (txId: string) => {
    const status = await (
      wallet?.adapter as LeoWalletAdapter
    ).transactionStatus(txId);
    setStatus(status);
  };


    const dataFetch = async () => {
      const suggBox: HTMLElement = document.querySelector(".autocom-box")!;
      const inputBox: HTMLInputElement = document.querySelector("input")!;
      let userValue: string = inputBox?.value.toLowerCase().replace(/[^(\x61-\x7A||\x30-\x39)]/g, "");   
      let suffix = document.querySelector('#suffix');
      let listData :string = "<li>" + userValue + suffix.value + "<div id=\"loader\"></div></li>";
      let encoded_name : string = encode_name(userValue)
      suggBox.innerHTML = listData;
      const datam = await (
        await fetch(
          "https://vm.aleo.org/api/testnet3/program/zns_registry_v1_4.aleo/mapping/domain_taken/%7Btld:6837765u128,name:" + encoded_name + "u128,subname:0u128%7D",
          {headers: {'Content-Type': 'application/json'}, method: "GET"}
        )
      ).json();
      setDatam(datam);
      if (datam === null && suffix.value == ".zexe"){
        let newlistData : string = "<li id=\"valid\">" + userValue + suffix.value + "<button id=\"mint-button\"></button></a><div id=\"check\">Click to Register!</div></li>";
        suggBox.innerHTML = newlistData;
        document.getElementById("mint-button")!.addEventListener("click", load_modal, false);
      } else {
        let newlistData : string = "<li id=\"invalid\">" + userValue + suffix.value + "<button id=\"goto-button\"></button><div id=\"xmark\">Registered</div></li>";
        suggBox.innerHTML = newlistData;
        document.getElementById("goto-button")!.addEventListener("click", () => {redirect(userValue + suffix.value);}, false);
      }
    };


    function redirect(currentname){
      window.history.pushState({}, '', routes.profileProfile + '?name=' + currentname);
      router.reload();
    }


    const toggleSwitch = () => {
      setIsOn(!isOn);
      setFunctionName((!isOn ? 'create_domain_private' : 'create_domain_public'));
    }
    const toggleCheckReg = () => {
      if (isCheckedReg){
        setRegistrar('');
      } else {
        setRegistrar("0");
      }
      setIsCheckedReg(!isCheckedReg);

    }
    const toggleCheckRes = () => {
      if (isCheckedRes){
        setResolver('');
      } else {
        setResolver("0");
      }
      setIsCheckedRes(!isCheckedRes);
    }
    const [isSubmitted, setIsSubmitted] = useState(false);
    const toggleSubmission = () => {
      setIsSubmitted(true);
      document.getElementById("registering-text").innerHTML = "Registering...";
    };
    useEffect(() => {
        if(showModal){
          if (isCheckedReg){
            document.getElementById("registrar_box")!.value = '';
          }
          if (isCheckedRes){
            document.getElementById("resolver_box")!.value = '';
          }
          const inputBox1: HTMLInputElement = document.getElementById("registrar_box")!;
          inputBox1?.addEventListener("keyup", (e: KeyboardEvent) => {
            let userData1: string = (e.target as HTMLInputElement).value; //user entered data
            if (userData1) {
              (e.target as HTMLInputElement).value = format1(userData1);
            }
          });
          const inputBox2: HTMLInputElement = document.getElementById("resolver_box")!;
          inputBox2?.addEventListener("keyup", (e: KeyboardEvent) => {
            let userData2: string = (e.target as HTMLInputElement).value; //user entered data
            if (userData2) {
              (e.target as HTMLInputElement).value = format1(userData2);
            }
          });
        };


        const inputBox: HTMLInputElement = document.querySelector("input")!;
        const suggBox: HTMLElement = document.querySelector(".autocom-box")!;
        const searchInput: HTMLElement = document.querySelector(".search-input")!;
        const suffixSelect = document.querySelector('#suffix');
        var output = suffixSelect.value;
        if (document.querySelector("domain_name") != null){
          let userValue: string = inputBox?.value.toLowerCase().replace(/[^(\x61-\x7A||\x30-\x39)]/g, "");
          document.querySelector("domain_name")!.innerHTML = userValue + output;
        }
        suffixSelect?.addEventListener("change", (event) => {
          let userData: string = inputBox.value;
          output = document.querySelector('#suffix').value;
          if (userData){
            let userValue: string = inputBox?.value.toLowerCase().replace(/[^(\x61-\x7A||\x30-\x39)]/g, "");
            let listData : string = "<li id=\"status-bar\">" + userValue + output + "<button id=\"search-button\">Search</button></li>";
            suggBox.innerHTML = listData;        
            setCurrentName(userValue + output);
            setCurrentDomain(userValue);
            document.getElementById("search-button")!.addEventListener("click", dataFetch, false);
          }
        });
        inputBox?.addEventListener("keyup", (e: KeyboardEvent) => {
            let userData: string = (e.target as HTMLInputElement).value; //user entered data
            const output = document.querySelector('#suffix').value;
            if (userData) {
                searchInput?.classList.add("active"); //show autocomplete box
                let listData: string;
                let userValue: string = inputBox?.value.toLowerCase().replace(/[^(\x61-\x7A||\x30-\x39)]/g, "");
                setCurrentName(userValue + output);
                setCurrentDomain(userValue);
                listData = "<li id=\"status-bar\">" + userValue + output + "<button id=\"search-button\">Search</button></li>";
                suggBox.innerHTML = listData;
                document.getElementById("search-button")!.addEventListener("click", dataFetch, false);
            } else {
                searchInput?.classList.remove("active"); //hide autocomplete box
            }
        });
      });

      const router = useRouter();
      useEffect(() => {
        if(isGood){
          setTimeout(() => {
            window.history.pushState({}, '', routes.profileProfile + '?name=' + currentName);
            router.reload();
          }, 7000);
        }
      });

  return (
    <>
      <NextSeo
        title="ZNS Homepage"
        description="Zexe Name Service Homepage"
      />
      <div className="flex max-w-full flex-col items-center justify-center text-center">
      <div id="popup">
        {showModal &&
            <Modal onClose={() => {setShowModal(false); setIsCheckedReg(false); setIsCheckedRes(false); setIsSubmitted(false); setStatus(undefined); setIsGood(false); setIsBad(false); setIsOn(false);setFunctionName('create_domain_public');}}>
              <div id="check-div" data-isSubmitted={isSubmitted} data-isGood={isGood}>
                <svg id="checkmark" className="checkmark" data-isGood={isGood} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle data-isGood={isGood} id="checkmark__circle" className="checkmark__circle" cx="26" cy="26" r="45" fill="none"/> <path data-isGood={isGood} id="checkmark__check" className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>

              </div>
              <div id="loader2" data-isSubmitted={isSubmitted} data-isGood={isGood} data-isBad={isBad}>
              </div>
              <div id = "registering-text" data-isSubmitted={isSubmitted} data-isGood={isGood} data-isBad={isBad}></div>
              <div id = "tx-status" data-isSubmitted={isSubmitted} data-isGood={isGood}>
                {transactionId && (
                  <div>
                    <div>{`Transaction status: ${status}`}</div>
                  </div>
                )}
                {isBad && (
                  <div>
                    <div>{`${status} : Please sign in to Leo Wallet`}</div>
                  </div>
                )}
              </div>
              <div id="inner-modal" data-isSubmitted={isSubmitted}>
              <h2 id ="domain_name" className="text-3xl font-bold pb-6 pl-1 w-500">
              {currentName}
              </h2>
              <hr id="popup-line"></hr>
              <div className="switch" data-isOn={isOn} onClick={toggleSwitch}>
                <motion.div className="handle" layout transition={spring} />
              </div>
              <div id="pub" data-isOn={isOn}>Public</div>
              <div id="priv" data-isOn={isOn}>Private</div>
              <div className ="pt-5 pb-2 text-xl">Registrar:</div>
              <input
                    className="h-8 w-3/4 appearance-none border-r-0 rounded-lg  bg-white py-1 text-xl tracking-tighter text-black outline-none transition-all placeholder:text-slate-950 focus:border-gray-900 pl-3 dark:border-gray-600 dark:text-slate-950 dark:placeholder:text-gray-500 dark:focus:border-gray-500"
                    placeholder="registrar.aleo"
                    id="registrar_box"
                    autoComplete="off"
                    maxLength="20"
                    spellCheck="false"
                    data-isChecked={isCheckedReg}
                    onChange={(event) => setRegistrar(event.currentTarget.value.replace('.aleo', ''))}
                />
              <div className ="pt-4"></div>
              <input type="checkbox" id="registrar_check" data-isChecked={isCheckedReg} onClick={toggleCheckReg} className='ml-1 focus:ring-0 focus:ring-offset-0 cursor-pointer'></input>
              <label for="registrar_check" className='pl-2 pointer-events-none'>Use default?</label>
              <div className ="pt-8 pb-2 text-xl">Resolver:</div>
              <input
                    className="h-8 w-3/4 appearance-none border-r-0 rounded-lg  bg-white py-1 text-xl tracking-tighter text-black outline-none transition-all placeholder:text-slate-950 focus:border-gray-900 pl-3 dark:border-gray-600 dark:text-slate-950 dark:placeholder:text-gray-500 dark:focus:border-gray-500"
                    placeholder="resolver.aleo"
                    id="resolver_box"
                    autoComplete="off"
                    maxLength="20"
                    spellCheck="false"
                    data-isChecked={isCheckedRes}
                    onChange={(event) => setResolver(event.currentTarget.value.replace('.aleo', ''))}
                />
              <div className ="pt-4"></div>
              <input type="checkbox" id="resolver_check" data-isChecked={isCheckedRes} onClick={toggleCheckRes} className='ml-1 focus:ring-0 focus:ring-offset-0 cursor-pointer'></input>
              <label for="resolver_check" className='pl-2 pointer-events-none'>Use default?</label>
              <div className ="pt-10"></div>
              <button id="submit-button" onClick={() => {toggleSubmission(); handleSubmit();}} disabled={!publicKey || (!registrar && !isCheckedReg) || (!resolver && !isCheckedRes)} className={!publicKey ? "scale-90 text-lg font-bold pb-10 text-center ml-24" : "scale-90 text-2xl font-bold pb-10 ml-40  text-center items-center"}>{!publicKey ? 'Connect Your Wallet' : 'Submit'}</button>
              <div className ="pt-10"></div>
            </div>
            </Modal>

        }
        </div>
        <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y : 0}}
                  transition={{ duration: 0.75, ease: "easeIn"}}
          >
        <div className="flex max-w-full flex-col items-center justify-center text-center">  
        <div className="relative w-52 scale-150 pb-20">
          {isMounted && (
            <Image src={logo} alt="404 Error" />
          )}
        </div>
        <h2 className="text-8xl scale-125 whitespace-nowrap pb-16 inline font-bruno uppercase dark:bg-gradient-to-r dark:bg-clip-text dark:text-transparent from-regal-blue to-cyan-400">
          Zexe Name Service
        </h2>
        </div>
        </motion.div>
            <motion.div
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y : 0}}
                      transition={{ duration: 0.75, ease: "easeIn", delay : 0.75}}
            >
            <span className="flex w-[40rem] justify-center items-center">
                <input
                    className="h-16 w-full appearance-none rounded-r-none border-r-0 rounded-lg  bg-white py-1 text-xl tracking-tighter text-black outline-none transition-all placeholder:text-slate-950 focus:border-gray-900 ltr:pr-5 ltr:pl-5 rtl:pr-10 dark:border-gray-600 dark:text-slate-950 dark:placeholder:text-gray-500 dark:focus:border-gray-500"
                    placeholder="Search for a name"
                    autoComplete="off"
                    maxLength="20"
                    spellCheck="false"
                />
                <select id="suffix" className="h-16 rounded-l-none border-l-0 font-size: 1.25em; appearance-none rounded-lg bg-[#0172e0] py-1 text-lg tracking-tighter text-white outline-none transition-all placeholder:text-white  ltr:pr-10 ltr:pl-4 ">
                    <option className = "bg-white text-black" value=".zexe">.zexe</option>
                </select>
            </span>
            </motion.div>

            <div className="search-input">
              <span id="box" className = "w-[40rem]">
                <div className ="autocom-box w-[40rem]">
                </div>
            </span>
            </div>
        </div>
    </>
  );
};

HomePage.getLayout = function getLayout(page) {
  return (
    <DashboardLayout contentClassName="flex items-center justify-center">
      {page}
    </DashboardLayout>
  );
};

export default HomePage;



