'use client';

import * as React from 'react';

import { Prisma } from '@prisma/client';
import { Formik } from 'formik';
import ClipLoader from 'react-spinners/ClipLoader';

import signUpSchema from './schema';

interface InjectedProps {
  handleFormSubmit: (payload: Prisma.UserCreateInput) => void;
}

export function SignUpForm(props: InjectedProps) {
  const { handleFormSubmit } = props;
  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
      }}
      validationSchema={signUpSchema}
      onSubmit={async (values, { resetForm }) => {
        const payload = {
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
        };

        await handleFormSubmit(payload);
        resetForm({ values: { name: '', email: '', password: '' } });
      }}
    >
      {({ handleBlur, handleChange, handleSubmit, errors, touched, isSubmitting }) => (
        <form className="form" onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="form__body">
              <div className="sm:col-span-4">
                <label className="form__label" htmlFor="name">
                  Name
                </label>
                <div className="mt-2">
                  <input
                    data-test-id="sign-up-form-name"
                    type="text"
                    className="form__input"
                    placeholder="Name"
                    name="name"
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.name && touched.name && <p>{errors.name}</p>}
              </div>
              <div className="sm:col-span-4">
                <label className="form__label" htmlFor="email">
                  Email
                </label>
                <div className="mt-2">
                  <input
                    data-test-id="sign-up-form-email"
                    type="email"
                    className="form__input"
                    placeholder="email"
                    name="email"
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.email && touched.email && <p>{errors.email}</p>}
              </div>
              <div className="sm:col-span-4">
                <label className="form__label" htmlFor="password">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    data-test-id="sign-up-form-password"
                    type="password"
                    className="form__input"
                    placeholder="password"
                    name="password"
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.password && touched.password && <p>{errors.password}</p>}
              </div>
            </div>

            <div className="form__footer">
              <button type="reset" className="button button--secondary" name="reset" value="Reset">
                Cancel
              </button>
              {(!isSubmitting && (
                <button
                  type="submit"
                  name="submit"
                  data-test-id="sign-up-form-submit"
                  disabled={isSubmitting}
                  value="Submit"
                  className="button button--primary"
                >
                  Sign Up
                </button>
              )) || <ClipLoader aria-label="application-loader" />}
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
}

export default SignUpForm;
