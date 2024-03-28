import { useIntl } from "react-intl";

export const getGreeting = () => {
  const intl = useIntl();
  const hour = new Date().getHours();
  let greeting;

  if (hour === 12) {
    greeting = intl.formatMessage({
      id: "dashboard.greetingNoon",
      defaultMessage: "Good Noon"
    });
  }
  else if (hour < 12) {
    greeting =  intl.formatMessage({
      id: "dashboard.greetingMorning",
      defaultMessage: "Good morning"
    });
  }
  else if (hour > 18) {
    greeting =  intl.formatMessage({
      id: "dashboard.greetingEvening",
      defaultMessage: "Good Evening"
    });
  }
  else if (hour > 12) {
    greeting =  intl.formatMessage({
      id: "dashboard.greetingAfternoon",
      defaultMessage: "Good Afternoon"
    });
  }

  return greeting;
}


export const getDate = (epoch: number | string, formatOprions={
    year: "numeric",
    month: "long",
    day: "2-digit",
    weekday: "long"
  } as const) => {
  const intl = useIntl();

  return intl.formatDate(new Date(epoch), formatOprions);
}
