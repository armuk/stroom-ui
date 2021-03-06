/*
 * Copyright 2017 Crown Copyright
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

import { ErrorMessage, Field, Form, Formik, FormikActions } from "formik";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { Credentials } from "components/authentication/types";
import Button from "components/Button";
import { hasAnyProps } from "lib/lang";
import * as Yup from "yup";

const LoginValidationSchema = Yup.object().shape({
  email: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

const LoginForm: React.FunctionComponent<{
  onSubmit: (
    credentials: Credentials,
    formikActions: FormikActions<Credentials>,
  ) => void;
  allowPasswordResets?: boolean;
}> = ({ onSubmit, allowPasswordResets }) => (
  <Formik
    onSubmit={onSubmit}
    initialValues={{ email: "", password: "" }}
    validationSchema={LoginValidationSchema}
  >
    {({ errors, touched, status }) => {
      const isPristine = !hasAnyProps(touched);
      const hasErrors = hasAnyProps(errors);
      return (
        <div className="content-floating-without-appbar">
          <div className="Login__container">
            <Form>
              <div className="Login__content">
                <div className="Login__icon-container">
                  <img
                    src={require("../../images/infinity_logo.svg")}
                    alt="Stroom logo"
                  />
                </div>
                <div className="field-container vertical">
                  <div className="horizontal-label-and-validation-container">
                    <label>Email</label>
                    <ErrorMessage
                      name="email"
                      render={msg => (
                        <div className="validation-error">{msg}</div>
                      )}
                    />
                  </div>
                  <Field name="email" autoFocus />
                </div>
                <div className="field-container vertical">
                  <div className="horizontal-label-and-validation-container">
                    <label>Password</label>
                    <ErrorMessage
                      name="password"
                      render={msg => (
                        <div className="validation-error">{msg}</div>
                      )}
                    />
                  </div>
                  <Field name="password" type="password" />
                </div>
                <div className="Login__status-container">
                  {status ? (
                    <div className="validation-error">{status}</div>
                  ) : (
                    <div />
                  )}
                  {allowPasswordResets ? (
                    <NavLink
                      className="Login__reset-password"
                      to={"/resetPasswordRequest"}
                    >
                      Reset password?
                    </NavLink>
                  ) : (
                    undefined
                  )}
                </div>
                <div className="Login__actions page__buttons Button__container">
                  <Button
                    appearance="contained"
                    action="primary"
                    disabled={isPristine || hasErrors}
                    type="submit"
                    text="Sign in"
                  />
                </div>
              </div>
            </Form>
          </div>
        </div>
      );
    }}
  </Formik>
);

export default LoginForm;
