/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use  file except in compliance with the License.
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

import Button from "components/Button";
import { AsyncUserSelect } from "components/users";
import { Formik } from "formik";
import * as React from "react";

interface DropDownValues {
  label: string;
  value: number;
}

const CreateTokenForm: React.FunctionComponent<{
  onSubmit: (userId: string) => void;
  onBack: () => void;
  idToken: string;
  userServiceUrl: string;
}> = ({ onSubmit, onBack, userServiceUrl, idToken }) => {
  return (
    <div className="CreateTokenForm-card">
      <Formik
        initialValues={
          { user: { label: "", value: -1 } } as { user: DropDownValues }
        }
        onSubmit={(values, actions) => {
          onSubmit(values.user.label);
          actions.setSubmitting(false);
        }}
        render={({ handleSubmit, setFieldValue, values }) => {
          const submitIsDisabled = values.user === undefined;
          return (
            <form onSubmit={handleSubmit}>
              <div className="header">
                <Button
                  appearance="default"
                  icon="arrow-left"
                  text="Back"
                  onClick={() => onBack()}
                />
              </div>
              <div className="container">
                <div className="section">
                  <div className="section__title">
                    <h3>User&apos;s email</h3>
                  </div>
                  <div className="section__fields">
                    <div className="section__fields__row">
                      <div className="field-container">
                        <div className="label-container">
                          <label />
                        </div>
                        <AsyncUserSelect
                          onChange={setFieldValue}
                          userServiceUrl={userServiceUrl}
                          idToken={`${idToken}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer">
                <Button
                  appearance="default"
                  action="primary"
                  disabled={submitIsDisabled}
                  icon="plus"
                  type="submit"
                  text="Create"
                />
              </div>
            </form>
          );
        }}
      />
    </div>
  );
};

export default CreateTokenForm;
