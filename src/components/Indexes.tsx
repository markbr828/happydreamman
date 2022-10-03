import React, { useState, useEffect } from 'react';
import ModalConnect from './GeneralComponents/ModalConnect';
import Sidebar from './GeneralComponents/Sidebar';
import TopNav from './GeneralComponents/TopNav';
import Load from './GeneralComponents/Load';
import { useWeb3React } from '@web3-react/core';
import IndexesTable from './IndexesComponents/IndexesTable';
import { useToasts } from 'react-toast-notifications';
import { Infura_API, index_backend_url } from '../constants';
import axios from 'axios';


function Farm(props: any) {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [indexes, setIndexes]: any = useState([]);
  const { addToast } = useToasts();



  async function fetchSetTokenIndexes() {
    try {
      const response = await axios.get(index_backend_url);
      console.log("response: ", response);
      if (response.data) {
        setIndexes(response.data);
        setIsLoading(false);
        addToast("Loaded Settoken Indexes", {
          appearance: "success",
          autoDismiss: true,
        });
      }
    } catch (error) {
    }
  }

  useEffect(() => {
    loadData();
  }, [])

  function loadData() {
    fetchSetTokenIndexes();
  }

  const html = (
    <div id="page-content-wrapper">
      <TopNav show={[show, setShow]} />
      <div className="right-side">
        <div className="container-fluid">
          <div className="row mt-4">
            <h1>Indexes</h1>
            <p>SetToken Indexes</p>
          </div>
          {
            isLoading ? <Load loaded={true} />
              :
              <React.Fragment>

                <div className="row my-4">
                  <div className="col-md-12">
                    <div className="card box-2">
                      <div className="card-header">
                        <h5>All SetTokens</h5>
                        <IndexesTable availableSearch={true} rows={indexes} />
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
          }

        </div>
        <div className="mt-5">
          <footer>
            <p className="text-center text-white">
              <a href="" className="text-white"><small>Terms &amp; Condition</small></a> | <a href="" className="text-white"><small>Privacy Policy</small></a>
              <br />
              <small>© 2021 ABC Token</small>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
  return <div className="d-flex" id="wrapper">
    <Sidebar current={props.current} />
    {html}
    <ModalConnect show={show} setShow={setShow} />
  </div>;
}

export default Farm;