import React from "react"; 
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
   <div className="m-4 sm:m-10 text-red-600 text-center text-xl sm:text-3xl">
  {t("error.cantFetchData", "Error!!! can't fetch data....")}
</div>

  );
}

export default NotFound;
