import { ApexOptions } from "apexcharts";
import DashBoardLayout from 'components/dashboard';
import { Fragment } from 'react/jsx-runtime';
import { getSeasons } from "api/seasons";
import { useAlert } from "context/AlertProvider";
import { useIntl } from "react-intl";
import { useQuery } from "react-query";
import useQueryCache from "hooks/useQueryCache";
import { useState } from "react";

const Home = () => {
  const intl = useIntl();
  const { showAlert } = useAlert();
  const [seasonsOptions, setSeasonsOptions] = useState<Array<any>>([]);

  const { GET_QUERY_KEY } = useQueryCache("seasons");


  const { isLoading: isSeasonsOptionsLoading } = useQuery({
    queryKey: GET_QUERY_KEY,
    queryFn: () => getSeasons(),
    onSuccess: (results) => {
      setSeasonsOptions(results.map(e => { return { label: e.name, value: e._id } }));
      console.log(results)
    },
    onError: (error) => {
      console.log(error);
      showAlert(
        intl.formatMessage({
          id: "seasons.get.seasons.error",
          defaultMessage: "No seasons found",
        }),
        "error"
      );
    },
  });

  const graphSeries = [{
    name: 'Month',
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  }];

  const graphOptions: ApexOptions = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 1,
      colors: ["#15A260"]
    },
    fill: {
      colors: ["#15A260"]
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      },
			
    },
		colors: ["#15A260"]
  }

	return (
		<Fragment>
			<DashBoardLayout
        isSeasonsOptionsLoading={isSeasonsOptionsLoading}
				seasonsOptions={seasonsOptions} 
				graphSeries={graphSeries} 
				graphOptions={graphOptions} />
		</Fragment>
	);
};

export default Home;
