import {
  ArrowRight,
  ArrowUp,
  FilePlus
} from "@phosphor-icons/react";
import {
  Box,
  BoxProps,
  Button,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { FormattedDate, FormattedMessage } from "react-intl";
import { Fragment, ReactNode, useEffect, useState } from "react";
import Select, { StylesConfig } from "react-select";
import { getDate, getGreeting } from "shared/date-helpers";

import { ApexOptions } from "apexcharts";
import SplineGraph from "./SplineGraph";
import { getIndicators } from "api/dashbaoard";
import { useAlert } from "context/AlertProvider";
import { useIntl } from "react-intl";
import { useQuery } from "react-query";
import { useThemMode } from "context/ThemeProvider";
import { useUser } from "context/UserProvider";

const gridGap = "1.5rem";
const borderRadius = "0.5rem";
const seperator = { xl: "2px solid #D7D3D0" };

const cardProps = {
  backgroundColor: "background.paper",
  borderRadius,
  padding: "1.5rem"
}

const reactSelectStyles: StylesConfig = {
  control: base => ({
    ...base,
    height: 54,
    width: 240,
    borderRadius
  }),
  option: base => ({
    ...base,
  }),
  menu: base => ({
    ...base,
    width: 240
  }),
  indicatorSeparator: () => ({display:'none'})
};

const DashBoardLayout = (props: any) => {
  const { mode } = useThemMode();
  const { user } = useUser();
  const intl = useIntl();
  const USER_GREETING = getGreeting();
  const FORMATTED_DATE = getDate(new Date().getTime());
  const { showAlert } = useAlert();
  const [cardInfo, setCardInfo] = useState<any>([]);
  const [seasonSelected, setSeasonSelected] = useState<any>();

  const { isSeasonsOptionsLoading, seasonsOptions, graphSeries, graphOptions } = props;

  useEffect(() => {
    if (seasonsOptions.length)
      setSeasonSelected(seasonsOptions.at(-1));
  }, [seasonsOptions]);

  // TODO: Loading state
  useQuery({
    queryKey: seasonSelected?.value,
    queryFn: () => getIndicators(seasonSelected?.value),
    enabled: !!seasonSelected?.value,
    onSuccess: (results) => {
      console.log(results);
      const { season, totals, averages, payrollToTodayData } = results
      const { product } = season;
      const currencyName = season?.currency?.name;
      const unitName = season?.unit.name;
      
      setCardInfo({
        harvestInfo : [
          {
            label: <FormattedMessage defaultMessage="PRODUCT" id="dashboard.labels.product" />,
            content: product?.name
          },
          {
            label: <FormattedMessage defaultMessage="START DATE" id="dashboard.labels.startDate" />,
            content: <FormattedDate 
              value={new Date(season?.startDate)} 
              year="numeric"
              month="short"
              day="2-digit" />
          },
          {
            label: <FormattedMessage defaultMessage="PRICE PER UNIT" id="dashboard.labels.pricePerUnit" />,
            content: `${ currencyName } ${ Number(season?.price).toFixed(2) }`
          },
          {
            label: <FormattedMessage defaultMessage="HARVEST DAYS" id="dashboard.labels.harvestDays" />,
            content: totals?.harvestDays
          },
          {
            label: <FormattedMessage defaultMessage="TOTAL HARVEST AMOUNT" id="dashboard.labels.totalHarvestAmount" />,
            content: `${ Number(totals?.totalHarvest).toFixed(2) } ${ unitName }`
          }
        ],
      midSectionInfo: [
        {
          label: <FormattedMessage defaultMessage="SEASON'S TOTAL PAYROLL" id="dashboard.labels.seasonsTotalPayroll" />,
          content: `${ currencyName } ${ Number(totals?.totalPayroll).toFixed(2) }`,
          perIncrease: `${ averages?.avePayrollChange ?? 0 } %`
        },
        {
          label: <FormattedMessage defaultMessage="TODAY'S COLLECTION" id="dashboard.labels.todaysCollection" />,
          content: `${ Number(totals?.todaysHarvest).toFixed(2) } ${ unitName }`,
          perIncrease: `${ averages?.aveHarvestChange ?? 0 } %`
        }
      ],
      payrollInfo: {
        payrollToToday: {
          label: "PAYROLL TO THIS DAY",
          content: `${ currencyName } ${ Number(payrollToTodayData?.grossAmount).toFixed(2) }`,
          startDate: <FormattedDate 
            value={new Date(payrollToTodayData?.startDate)} 
            month="short" 
            day="2-digit" />,
          daysLeft: payrollToTodayData?.daysRemaining
        }
      }
    })
    },
    onError: (error) => {
      console.log(error);
      showAlert(
        intl.formatMessage({
          id: "dashboard.get.indicators.error",
          defaultMessage: "Some error occurred, Please try again later",
        }),
        "error"
      );
    },
  });
  
  return (
    <Box padding={{md: "2rem"}}>
      <Grid container mb="2rem" rowSpacing={gridGap} justifyContent="space-between" alignItems="flex-end">
        <Grid item>
          <Typography 
            fontSize="2rem" 
            fontWeight={700}
            variant="h1">
            { USER_GREETING }, { user.name }
          </Typography>
          <Typography>
            <FormattedMessage id="dashboard.greeting" defaultMessage="Today is" />
            &ensp;
            <Typography
              px="5px"
              bgcolor="background.paper"
              display="inline-block" 
              border="1px solid #D7D3D0"
              borderRadius="4px">
              { FORMATTED_DATE }
            </Typography>
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" endIcon={<FilePlus />}>
            Add Harvest Entry
          </Button>
        </Grid>
      </Grid>
      <HarvestInfo
        mode={mode}
        cardInfo={cardInfo?.harvestInfo}
        seasonSelected={seasonSelected}
        setSeasonSelected={setSeasonSelected}
        seasonsOptions={seasonsOptions}  
        isLoading={isSeasonsOptionsLoading}  />
      <MidSectionInfo
        cardInfo={cardInfo?.midSectionInfo} 
        series={graphSeries} 
        options={graphOptions} />
      <PayrollInfo cardInfo={cardInfo?.payrollInfo} />
    </Box>
  )
}

export interface ISeasonOptions {
  label: string;
  value: string;
}

interface ICardLayout {
  label: string;
  content: string | ReactNode | undefined;
  boxProps?: BoxProps;
}

export interface IApexChartProps {
  series: any;
  options: ApexOptions;
}

const CardLayout = (props: ICardLayout) => {
  return (
    <Box {...props?.boxProps}>
      <Typography
        color="#79716B"
        fontSize="1.14rem"
        fontWeight={600}>{ props.label }</Typography>
      <Typography 
        fontWeight={600} 
        fontSize="1.5rem" 
        mt="1.3rem">
        { props.content }
      </Typography>
    </Box>
  )
}

const HarvestInfo = (props: any) => {
  const { 
    mode,
    cardInfo,
    seasonSelected,
    setSeasonSelected,
    seasonsOptions, 
    isSeasonsOptionsLoading } = props;

  return (
    <Grid {...cardProps} xs={12}>
      <Box mb="1.5rem">
        <Select
          placeholder={<FormattedMessage id="dashboard.seasonMenuPlaceHolder" defaultMessage="Select Season" />}
          options={seasonsOptions} 
          isLoading={isSeasonsOptionsLoading}
          styles={reactSelectStyles}
          value={seasonSelected}
          onChange={(e) => setSeasonSelected(e)}
          theme={(theme) => ({
            ...theme,
            colors: {
            ...theme.colors,
              text: "white",
              neutral0: mode === "light" ? "white" : "black",
              primary50: "#15A260",
              primary25: "#C5E8D7",
              primary: "#055E40",
            },
          })} />
      </Box>
      <Grid container rowSpacing={{ xs: "2rem" }} columnSpacing={{ lg: "2rem" }}>
        {
          cardInfo?.map((item: any, idx: number) => {
            return (
              <Grid key={idx} item xs={12} md={6} lg={3} xl={2.25}>
                <CardLayout 
                  label={item.label} 
                  content={item.content} 
                  boxProps={idx === (cardInfo.length - 1) ? {} : {
                    borderRight: seperator
                  }} />
              </Grid>
            )
          })
        }
      </Grid>
    </Grid>
  )
}

const MidSectionInfo = (props: any) => {
  return (    
    <Grid container pt={gridGap} columnSpacing={gridGap} rowSpacing={{md: gridGap}} alignItems="stretch">
      <Grid item xs={12} md={12} xl={9}>
        <Box {...cardProps}>
          <SplineGraph series={props.series} options={props.options} />
        </Box>
      </Grid>
      <Grid item xs={12} md={12} xl={3} height="100%">
          <Grid container height="100%" spacing={gridGap} alignItems="stretch">

            {
              props?.cardInfo?.map((item: any, idx: number)=> {
               return (
               <Grid key={idx} item xs={12} md={6} lg={6} xl={12}>
                <CardLayout 
                  label={ item?.label }
                  content={
                    <Fragment>
                      <span>{ item?.content }</span>
                      <Typography mt="1rem" color="#79716B" display="flex" alignItems="center">
                        <Typography color="#15A260" fontSize="0.875rem" fontWeight={600} variant="caption">
                          <ArrowUp /> { item?.perIncrease }
                        </Typography>
                        &nbsp; average
                      </Typography>
                    </Fragment>
                  } 
                  boxProps={cardProps} />
              </Grid>)
              })
            }
          </Grid>
      </Grid>
    </Grid>
  )
}

const PayrollInfo = (props: any) => {
  const theme = useTheme();
  const {cardInfo} = props;
  const {payrollToToday} = cardInfo || {};
  return (
    <Grid container mt="2.25rem" spacing={gridGap}>
      <Grid item xs={12} lg={3}>
        <Box {...cardProps}>
          <Typography
            color="#79716B"
            fontSize="1.14rem"
            fontWeight={600}>PAYROLL TO THIS DATE</Typography>
          <Box
            p="0.5rem"
            mt="1.3rem"
            bgcolor={theme.palette.grey[100]}
            padding="0.5rem"
            borderRadius={borderRadius}>
            <Typography
              m="0"
              fontWeight={600} 
              fontSize="1.5rem">
              { payrollToToday?.content }
            </Typography>
          </Box>
          <Box display="flex" mt="1.0625rem" alignItems="center" justifyContent="space-between">
            <Typography
              color="#1C1917"
              fontSize="0.875rem"
              fontWeight={500}>Starting: Mar 16</Typography>
            <Box 
              display="inline-flex"
              padding="1px 9px"
              alignItems="center"
              justifyContent="center"
              border="1px solid #17B26A"
              borderRadius="100px"
              width="5.437"
              height="1.375">
              <Typography
                color="#17B26A"
                fontSize="0.75rem"
                fontWeight={500}>
                <Box mr="8px" display="inline-block" width="0.5rem" height="0.5rem" borderRadius="100%" bgcolor="#17B26A" />
                { payrollToToday?.daysLeft } days left
              </Typography>
            </Box>
          </Box>
          <button style={{ padding: 0, backgroundColor: "transparent", border: "none" }}>
            <Typography
              mt="1.2rem"
              color="#055E40"
              display="flex"
              alignItems="center"
              fontWeight={500}>
              Run Payroll&ensp;<ArrowRight />
            </Typography>
          </button>
        </Box>
      </Grid>

      {/* <Grid item xs={12} lg={9}>
        <Box {...cardProps}>
          <Typography fontSize="1rem" fontWeight={500}>
            Recent Payrolls
          </Typography>
          <Grid container rowSpacing={gridGap} columnSpacing={gridGap}>
            <Grid item xs={12} md={6} lg={4}>
              <Box px="1rem" py="1.5rem" bgcolor={theme.palette.grey[100]} borderRadius={borderRadius}>
                <Typography fontSize="0.875rem" fontWeight={500}>
                  Feb 01 - Feb 15
                </Typography>
                <Grid container mt="1rem" rowSpacing="1rem" columnSpacing="1rem">
                  <Grid item xs={12} lg={6}>
                    <Box
                      display="flex"
                      alignItems="center"
                      bgcolor="background.paper"
                      padding="0.5rem"
                      borderRadius={borderRadius}>
                      <HandCoins size="1rem" />
                      <Typography fontSize="0.875rem" fontWeight={500}>&ensp;$8,384</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Box
                      display="flex"
                      alignItems="center"
                      bgcolor="background.paper"
                      padding="0.5rem"
                      borderRadius={borderRadius}>
                      <Plant size="1rem" />
                      <Typography fontSize="0.875rem" fontWeight={500}>&ensp;928kg</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} lg={4}>
              <Box px="1rem" py="1.5rem" bgcolor={bgHighlight} borderRadius={borderRadius}>
                <Typography fontSize="0.875rem" fontWeight={500}>
                  Feb 01 - Feb 15
                </Typography>
                <Grid container mt="1rem" rowSpacing="1rem" columnSpacing="1rem">
                  <Grid item xs={12} lg={6}>
                    <Box
                      display="flex"
                      alignItems="center"
                      bgcolor="white"
                      padding="0.5rem"
                      borderRadius={borderRadius}>
                      <HandCoins size="1rem" />
                      <Typography fontSize="0.875rem" fontWeight={500}>&ensp;$8,384</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Box
                      display="flex"
                      alignItems="center"
                      bgcolor="white"
                      padding="0.5rem"
                      borderRadius={borderRadius}>
                      <Plant size="1rem" />
                      <Typography fontSize="0.875rem" fontWeight={500}>&ensp;928kg</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Box px="1rem" py="1.5rem" bgcolor={bgHighlight} borderRadius={borderRadius}>
                <Typography fontSize="0.875rem" fontWeight={500}>
                  Feb 01 - Feb 15
                </Typography>
                <Grid container mt="1rem" rowSpacing="1rem" columnSpacing="1rem">
                  <Grid item xs={12} lg={6}>
                    <Box
                      display="flex"
                      alignItems="center"
                      bgcolor="white"
                      padding="0.5rem"
                      borderRadius={borderRadius}>
                      <HandCoins size="1rem" />
                      <Typography fontSize="0.875rem" fontWeight={500}>&ensp;$8,384</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Box
                      display="flex"
                      alignItems="center"
                      bgcolor="white"
                      padding="0.5rem"
                      borderRadius={borderRadius}>
                      <Plant size="1rem" />
                      <Typography fontSize="0.875rem" fontWeight={500}>&ensp;928kg</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid> */}

    </Grid>
  )
}

export default DashBoardLayout;
