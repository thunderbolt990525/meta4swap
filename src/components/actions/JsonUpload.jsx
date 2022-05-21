import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { create } from "ipfs-http-client";
import m4sAbi from "../abi/m4s_abi.json";
import Web3 from "web3/dist/web3.min.js";
import { db } from "../../firebase.config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
// import { ImageUpload } from "./ImageUpload";

const client = create("https://ipfs.infura.io:5001/api/v0");
const abi = m4sAbi;
export const JsonUpload = ({ disabled, metaData2, imageUrl, id }) => {
  const metaData = {
    id: id,
    ...metaData2,
    imageUrl: imageUrl,
    timestamp: serverTimestamp(),
    date: new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(Date.now()),
  };
  const metaDataJSONString = JSON.stringify(metaData);
  const [uploaded, setUploaded] = useState(false);
  const [metaDataUrl, setMetaDataUrl] = useState("");
  const [live, setLive] = useState(true);
  const [price, setPrice] = useState(0);
  const [btnDisabled, setbtnDisabled] = useState(true);

  console.log(price, live, metaDataUrl);

  const onClick = async (e) => {
    e.preventDefault();
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    var account = accounts[0];

    const M4SContract = new web3.eth.Contract(
      abi,
      "0x79F8B8aCeca83850fDAc539990e915644079751B",
      {
        from: account,
      }
    );
    M4SContract.methods
      .createItem(metaDataUrl, live, web3.utils.toWei(price))
      .send();
  };

  const uploadText = async (e) => {
    e.preventDefault();
    const docId = uuidv4();
    try {
      const added = await client.add(metaDataJSONString);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setMetaDataUrl(url);
      console.log(metaDataUrl);
      setUploaded(true);
      console.log(uploaded);
      setPrice(metaData.price);
      setLive(true);
      setbtnDisabled(false);
      await setDoc(doc(db, "listings", docId), metaData);
    } catch (err) {
      console.log("Error uploading the file : ", err);
    }
  };

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={uploadText}
        // disabled={disabled}
      >
        Upload Metadata
      </button>
      <a
        href={metaDataUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary"
      >
        {metaDataUrl === ""
          ? ""
          : `MetaData Url ${metaDataUrl.substring(0 - 27)}...`}
      </a>
      <button
        className="btn btn-primary"
        onClick={onClick}
        disabled={btnDisabled}
      >
        Create on Blockchain
      </button>
    </div>
  );
};
