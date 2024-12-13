import api from "./api";

// code demo
export const GetStatisticalAPI = () => {
  return api.get(`statistical`);
};
export const GetStatisticalRevenueAPI = (startDate, endDate) => {
  return api.post(`statistical/revenue-by-date`, {
    startDate: startDate,
    endDate: endDate,
  });
};
export const GetStatisticalBillsAPI = (startDate, endDate) => {
  return api.post(`statistical/billings`, {
    startDate: startDate,
    endDate: endDate,
  });
};
export const GetStatisticalImportReceiptAPI = (startDate, endDate) => {
  return api.post(`statistical/import-receipt`, {
    startDate: startDate,
    endDate: endDate,
  });
};
export const GetStatisticalProductsAPI = (startDate, endDate) => {
  return api.post(`statistical/product`, {
    startDate: startDate,
    endDate: endDate,
  });
};
