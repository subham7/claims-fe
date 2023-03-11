import { Button, InputAdornment, TextField, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'
import Layout1 from '../../src/components/layouts/layout1'
import * as yup from 'yup'
import { useFormik } from 'formik'

const useStyles = makeStyles({
  form: {
      display: 'flex-col',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '130px auto',
      width:'550px'
  },

  title: {
      fontSize: '36px',
      fontWeight: "500",
      marginBottom: '40px'
  },
  input: {
      width:"100%",
      marginTop: '6px',
      color: "#6475A3",
      borderRadius: '8px',
      '& input[type=number]': {
          '-moz-appearance': 'textfield'
      },
      '& input[type=number]::-webkit-outer-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0
      },
      '& input[type=number]::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0
      },
    },
  label: {
      marginTop: '30px',
      
    },
  btn: {
      width: '130px',
      fontFamily: 'sans-serif',
      fontSize: '16px',
      marginTop: '20px'
  }, 
  text: {
      color: "#6475A3",
      fontSize: '15px',
      marginTop: '8px'
  }

})

const validationSchema = yup.object({
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  LLC_name: yup.string('Enter LLC Name').required('LLC name is required').min(3, 'LLC Name should be atleast 3 characters long'),
  admin_name: yup.string("Enter Admin's name").required('Admin name is required'),
  location: yup.string("Enter arbitration location").required('Arbitration location is required'),
  general_purpose: yup.string('Enter general purpose')
})

const Homepage = () => {
  const classes = useStyles()

  const formik = useFormik({
    initialValues : {
      email: '',
      LLC_name: '',
      admin_name: '',
      location: '',
      general_purpose: '',
    },
    validationSchema : validationSchema, 
    onSubmit: (values) => {
      console.log(values)
    }
  })

  return (
    <>
        <Layout1 depositUrl={'eerrarear'} >
        <form className={classes.form} onSubmit={formik.handleSubmit}>
            
            <Typography className={classes.title}>Prepare a legal document</Typography>

            {/* Legal Entity Name */}
            <Typography className={classes.label}>Legal entity name</Typography>
            <TextField 
              placeholder="Name your LLC"
              variant='outlined' 
              name='LLC_name' 
              id='LLC_name'
              value={formik.values.LLC_name} 
              onChange={formik.handleChange}
              error={formik.touched.LLC_name && Boolean(formik.errors.LLC_name)}
              helperText={formik.touched.LLC_name && formik.errors.LLC_name}  
              className={classes.input} />

            {/* Admin Name */}
            <Typography className={classes.label}>Administrative member&apos;s name</Typography>
            <TextField 
              placeholder="Admin's full name" 
              variant='outlined' 
              name='admin_name' 
              id='admin_name'
              value={formik.values.admin_name} 
              onChange={formik.handleChange}
              error={formik.touched.admin_name && Boolean(formik.errors.admin_name)}
              helperText={formik.touched.admin_name && formik.errors.admin_name}
              className={classes.input} />

            <Typography className={classes.text}>Admin pays expenses & performs functions like reviewing member documentation & tax reporting.</Typography>

            {/* Location */}
            <Typography className={classes.label}>Arbitration Location</Typography>
            <TextField 
              value={formik.values.location} 
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
              placeholder="Eg. San Francisco" 
              variant='outlined' 
              name='location' 
              id='location' 
              className={classes.input} />
            
            <Typography className={classes.text}>Ideal to choose a location that is convenient to visit & follow state laws of at the time of disputes.</Typography>

            {/* General purpose */}
            <Typography className={classes.label}>General purpose statement</Typography>
            <TextField 
              placeholder="Eg. To facilitate ownership & other investments into real-estate, etc." 
              multiline rows={3} 
              variant='outlined' 
              name='general_purpose' 
              id='general_purpose' value={formik.values.general_purpose} 
              onChange={formik.handleChange}
              error={formik.touched.general_purpose && Boolean(formik.errors.general_purpose)}
              helperText={formik.touched.general_purpose && formik.errors.general_purpose}  className={classes.input} />
        
            {/* Email */}
            <Typography className={classes.label}>E-mail</Typography>
            <TextField 
              placeholder="Email address" 
              variant='outlined' 
              name='email' 
              id='email' 
              value={formik.values.email} 
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email} 
              className={classes.input}  />

            {/* Next */}
            <Button type='submit' variant='contained' className={classes.btn} >Next</Button>
        </form>
        </Layout1>
    </>
  )
}

export default Homepage