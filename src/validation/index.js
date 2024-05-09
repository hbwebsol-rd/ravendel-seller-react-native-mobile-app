import * as Yup from 'yup';

export const ForgotEmailValidation = Yup.object().shape({
  email: Yup.string().email().required('Enter valid Email'),
});

export const LoginValidation = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string().required('Password is required'),
});
