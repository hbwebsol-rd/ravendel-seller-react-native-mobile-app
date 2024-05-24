import * as Yup from 'yup';

export const ForgotEmailValidation = Yup.object().shape({
  email: Yup.string().email().required('Enter valid Email'),
});

export const LoginValidation = Yup.object().shape({
  email: Yup.string()
    .required('Enter email-id')
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      'Enter valid email-id',
    ),
  password: Yup.string().required('Password is required'),
});
