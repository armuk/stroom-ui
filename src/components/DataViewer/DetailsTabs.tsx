/*
 * Copyright 2018 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import * as moment from "moment";

import { DataRow } from "src/types";
import { useStreamDataRow } from "src/api/streamAttributeMap";
import Loader from "../Loader";

interface Props {
  data: DataRow;
}

const DetailsTabs: React.FunctionComponent<Props> = ({ data }) => {
  const dataRow = useStreamDataRow(data.meta.id);

  const renderData = React.useCallback(
    () => (
      <div className="tab-pane">{/* <DataDetails meta={dataRow} /> */}</div>
    ),
    [dataRow],
  );

  const renderDetails = React.useCallback(() => {
    return (
      dataRow && (
        <div className="tab-pane">
          <div className="StreamDetails__container">
            <div className="StreamDetails__table__container">
              <table className="StreamDetails__table">
                <tbody>
                  <tr>
                    <td>Stream ID</td>
                    <td>
                      <code>{dataRow.meta.id}</code>
                    </td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>
                      <code> {dataRow.meta.status}</code>
                    </td>
                  </tr>
                  <tr>
                    <td>Status MS</td>
                    <td>
                      {moment(dataRow.meta.statusMs).format(
                        "MMMM Do YYYY, h:mm:ss a",
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Stream Task ID</td>
                    <td>{/* <code> {details.data.processTaskId}</code> */}</td>
                  </tr>
                  <tr>
                    <td>Parent Stream ID</td>
                    <td>{/* <code>{details.data.parentDataId}</code> */}</td>
                  </tr>
                  <tr>
                    <td>Created</td>
                    <td>
                      {moment(dataRow.meta.createMs).format(
                        "MMMM Do YYYY, h:mm:ss a",
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Effective</td>
                    <td>
                      {moment(dataRow.meta.effectiveMs).format(
                        "MMMM Do YYYY, h:mm:ss a",
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Stream processor uuid</td>
                    TODO
                    {/* <td>{details.stream.processor.id}</td> */}
                  </tr>
                  <tr>
                    <td>Files</td>
                    TODO
                    {/* <td>{details.fileNameList}</td> */}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    );
  }, [dataRow]);

  const renderAttributes = React.useCallback(
    () => (
      <div className="tab-pane">
        <div className="StreamDetails__container">
          <div className="StreamDetails__table__container">
            <table className="StreamDetails__table">
              <tbody>
                TODO
                {/* {Object.keys(details.nameValueMap).map((key, index) => {
                if (key !== 'Until' && key !== 'Rule' && key !== 'Age') {
                  return (
                    <tr>
                      <td>{key}</td>
                      <td>
                        <code>{details.nameValueMap[key]}</code>
                      </td>
                    </tr>
                  );
                }
                return undefined;
              })} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
    [],
  );

  const renderRetention = React.useCallback(
    () => (
      <div className="tab-pane">
        <div className="RetentionDetails__container">
          <div className="RetentionDetails__table__container">
            <table className="RetentionDetails__table">
              <tbody>
                <tr>
                  <td>Age</td>
                  TODO
                  {/* <td>{details.nameValueMap.Age}</td> */}
                </tr>
                <tr>
                  <td>Until</td>
                  TODO
                  {/* <td>{details.nameValueMap.Until}</td> */}
                </tr>
                <tr>
                  <td>Rule</td>
                  TODO
                  {/* <td>{details.nameValueMap.Rule}</td> */}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
    [],
  );

  if (!dataRow) {
    return <Loader message="Loading Data" />;
  }

  const panes = [
    {
      menuItem: "Data",
      render: renderData,
    },
    {
      menuItem: "Details",
      render: renderDetails,
    },
    {
      menuItem: "Attributes",
      render: renderAttributes,
    },
    {
      menuItem: "Retention",
      render: renderRetention,
    },
  ];
  if (panes) {
    console.log("Panes defined"); // TODO
  }
  return (
    <div className="DetailsTabs__container">
      <div className="DetailsTabs__contained" />
    </div>
  );
};

export default DetailsTabs;
