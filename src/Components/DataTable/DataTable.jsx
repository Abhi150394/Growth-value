import { makeStyles } from '@mui/styles'
import MUIDataTable from 'mui-datatables'

const useStyles = makeStyles(theme => ({
    root: {
        boxShadow: " 0px 0px 30px rgba(84, 186, 175, 0.2), 0px 1px 4px rgba(84, 186, 175, 0.1)",

        "& .MuiTypography-root": {
            color: "#4D4D4D",
            fontSize: "24px",
            fontWeight: 600,
            fontFamily: "Inter !important",

        },
        "& .MuiTableCell-root": {
            fontWeight: 400,
            fontSize: "14px",
            fontFamily: "Inter !important",
        },
        "& .MuiTableCell-head": {
            fontWeight: 600,
            fontSize: "16px",
            color: "#4D4D4D",
            fontFamily: "Inter !important",

        },
        "& .MuiTableHead-root ": {
            borderBottom: "1px solid #54baaf70",
        },
        "& .MuiTableFooter-root": {
            borderBottom: "1px solid #fff"
        },
        "& .MuiTablePagination-toolbar": {
            color: "#4D4D4D",
            fontSize: "16px !important",
            fontWeight: 400,
            opacity: 0.8,
        },
        "& .MuiTablePagination-actions": {
            marginLeft: "0px"
        },
        '& .MuiTypography-body2': {
            display: "flex",
            alignItems: "center",
            fontSize: '14px',
        },

    },

}))



const DataTable = (props) => {
    const classes = useStyles()
    const { className, ...other } = props
    return (
        <>
            <MUIDataTable
                className={`${classes.root}  ${className}`}
                {...other}
                components={{

                }}
            />
        </>
    )
}

export default DataTable