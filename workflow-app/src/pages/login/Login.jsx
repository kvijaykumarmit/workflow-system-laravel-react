import React, {useEffect, useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config';
import { useAuth } from '../../context-providers/AuthContext';

function LoginPage(){

    const { user, login } = useAuth(); 
    const [errorFields, setErrorFields] = useState({});
    const navigate = useNavigate();     

    useEffect(() => { if (user) { navigate('/home'); }  }, [user, navigate]);

    const initialValues = {
        email: '',
        password: ''
    };
    
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
    });   

    const onSubmit = async (values) => {
        try {
          const response = await axios.post(`${API_URL.BASE_URL}${API_URL.LOGIN}`, values);       
          if (response.status === 200) {
            let user = response.data.user;
            user['token'] = response.data.token;
            login(user); 
            navigate('/home');           
          }
        } catch (error) {  
            if (error.response && error.response.status === 401) {
                let errors = (error.response.data?.errors || {});             
                setErrorFields(errors);
            } else {             
                // toast.error('An error occurred. Please try again later.', {
                //     position: toast.POSITION.TOP_RIGHT
                // });
            }
        }
    };

    return (<div className="container mt-5">
        <div className='row justify-content-center'>
            <div className='col-md-4'>
                <div className='card'>
                    <div className='card-header text-center'>
                        <h4>Login</h4>
                    </div>
                    <div className='card-body'>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ errors, touched, isValid, setFieldTouched, setFieldValue }) => (
                        <Form>
                            <div className='form-group mb-3'>
                                <label htmlFor='email' className='form-label'>Email</label>
                                <Field 
                                    id="email"
                                    name="email"
                                    type="email"
                                    onFocus={() => {
                                        setErrorFields(prev => ({ ...prev, email: '' }));
                                    }}
                                    onChange={(e) => {
                                        setFieldValue("email", e.target.value);
                                        setErrorFields(prev => ({ ...prev, email: '' })); // Clear error on change
                                    }}
                                    className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''} ${errorFields.email ? 'is-invalid' : ''}`}
                                    placeholder="Enter email" />
                              
                               <ErrorMessage name="email" component="small" className="text-danger" />                                        
                               {errorFields.email && <small className="text-danger">{errorFields.email}</small>}
                            </div>
                            <div className='form-group mb-3'>
                                <label htmlFor='password' className='form-label'>Password</label>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    onFocus={() => {
                                        setErrorFields(prev => ({ ...prev, password: '' }));
                                    }}
                                    onChange={(e) => {
                                        setFieldValue("password", e.target.value);
                                        setErrorFields(prev => ({ ...prev, password: '' })); // Clear error on change
                                    }}
                                    className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''} ${errorFields.password ? 'is-invalid' : ''}`}  // Ensure errorFields.password applies the 'is-invalid' class
                                    placeholder="Enter password" />
                                <ErrorMessage name="password" component="small" className="text-danger" />
                                {errorFields.password && <small className="text-danger">{errorFields.password}</small>}
                            </div>

                            <button type="submit" className="btn btn-primary w-100" disabled={!isValid}>Login</button>
                        </Form>
                        )}
                    </Formik>
                    </div>
                </div>
            </div>
        </div>
        {/* <ToastContainer /> */}
    </div>);
}

export default LoginPage;