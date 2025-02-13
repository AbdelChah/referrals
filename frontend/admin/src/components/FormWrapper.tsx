import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  FormContainer,
  FormBox,
  FormTitle,
  FormError,
  StyledButton,
  StyledTextField,
  LinkText,
} from './formWrapper.styles';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface FormWrapperProps {
  title: string | React.ReactNode;
  initialValues: { [key: string]: string };
  validationSchema: any;
  onSubmit: (values: { [key: string]: string }) => void;
  fields: { name: string; label: string; type: string }[];
  buttonLabel?: string;
  errorMessage?: string;
  children?: React.ReactNode;
  height?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  title,
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  buttonLabel,
  errorMessage,
  children,
  height,
  showCloseButton,
  onClose
}) => {
  return (
    <FormContainer height={height}>
      <FormBox>
        {showCloseButton && (
          <IconButton
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: 'grey',
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        <FormTitle variant="h5">{title}</FormTitle>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              {/* Render form fields dynamically */}
              {fields.map((field) => (
                <div key={field.name}>
                  <Field
                    as={StyledTextField}
                    fullWidth
                    label={field.label}
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    placeholder={field.label}
                    variant="outlined"
                    margin="normal"
                    error={Boolean(errors[field.name] && touched[field.name])}
                    helperText={errors[field.name] && touched[field.name] && errors[field.name]}
                  />
                </div>
              ))}
              {errorMessage && <FormError>{errorMessage}</FormError>}
              {buttonLabel && (
                <StyledButton type="submit" fullWidth>
                  {buttonLabel}
                </StyledButton>
              )}
            </Form>
          )}
        </Formik>
        {children && <LinkText>{children}</LinkText>}
      </FormBox>
    </FormContainer>
  );
};

export default FormWrapper;
