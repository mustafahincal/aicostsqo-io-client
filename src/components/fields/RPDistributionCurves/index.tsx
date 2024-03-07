import { useSiteContext } from "@/contexts/Site";
import React, { useEffect, useState } from "react";
import LineChart from "../../common/Charts/Line";
import { getRpDistributionCurves } from "@/api/rp";
import TopBar from "./TopBar";
import BarChart from "@/components/common/Charts/Bar";

const distributionsListInitialState = {
  pdf: {
    key: "pdf",
    label: "PDF",
    value: false,
  },
  cdf: {
    key: "cdf",
    label: "CDF",
    value: false,
  },
  histogram: {
    key: "histogram",
    label: "Histogram",
    value: false,
  },
};

const volumeTypesListInitialState = {
  volumeTheoric: {
    key: "volumeTheoric",
    label: "Volume Theoric",
    value: false,
  },
  volumeQuarry: {
    key: "volumeQuarry",
    label: "Volume Quarry",
    value: false,
  },
  totalVolumeOfMaxQs: {
    key: "totalVolumeOfMaxQs",
    label: "Total Volume Of MaxQs",
    value: false,
  },
};

const requestBody = {
  rpIdList: ["65d9ceac91e335b37a678068"],
  sourceList: ["volumeTheoric", "volumeQuarry", "totalVolumeOfMaxQs"],
  chartList: ["pdf", "histogram", "cdf"],
};

function RPDistributionCurves() {
  const { selectedRP } = useSiteContext();
  const [data, setData] = useState<null | any>(null);
  const [volumeTypes, setVolumeTypes] = useState(volumeTypesListInitialState);
  const [distributions, setDistributions] = useState(
    distributionsListInitialState
  );
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    setData(null);
    getRpDistributionCurves({
      ...requestBody,
      rpIdList: [selectedRP._id],
    }).then((res: any) => {
      const { rpId, ...rest } = res.data.result[0];
      setData(rest);
      console.log("res", rest);
    });
  }, [selectedRP]);

  function getChartData(distributionKey: any) {
    if (!data) return null;

    let chartData = null;

    switch (distributionKey) {
      case "cdf":
        chartData = {
          totalVolumeOfMaxQs: data?.totalVolumeOfMaxQs?.cdf,
          volumeQuarry: data?.volumeQuarry?.cdf,
          volumeTheoric: data?.volumeTheoric?.cdf,
        };
        break;
      case "pdf":
        chartData = {
          totalVolumeOfMaxQs: data?.totalVolumeOfMaxQs?.pdf?.observed,
          totalVolumeOfMaxQsExpected: data?.totalVolumeOfMaxQs?.pdf?.expected,
          volumeQuarry: data?.volumeQuarry?.pdf?.observed,
          volumeQuarryExpected: data?.volumeQuarry?.pdf?.expected,
          volumeTheoric: data?.volumeTheoric?.pdf?.observed,
          volumeTheoricExpected: data?.volumeTheoric?.pdf?.expected,
        };
        break;
      case "histogram":
        chartData = {
          totalVolumeOfMaxQs: data?.totalVolumeOfMaxQs?.histogram,
          volumeQuarry: data?.volumeQuarry?.histogram,
          volumeTheoric: data?.volumeTheoric?.histogram,
        };
        break;
      default:
        chartData = null;
    }

    return chartData;
  }

  return (
    <div className="flex flex-col gap-5">
      <TopBar
        volumeTypes={volumeTypes}
        distributions={distributions}
        setVolumeTypes={setVolumeTypes}
        setDistributions={setDistributions}
        showAnalysis={showAnalysis}
        setShowAnalysis={setShowAnalysis}
      />
      <div className="grid grid-cols-1 mt-12 gap-y-10">
        {data &&
          Object.entries(distributions).map(
            ([distributionKey, distributionObject]) => {
              if (distributionObject.value && distributionKey !== "histogram") {
                return (
                  <LineChart
                    key={distributionKey}
                    data={getChartData(distributionKey)}
                    text={distributionObject.label}
                    volumeTypes={volumeTypes}
                    showAnalysis={showAnalysis}
                  />
                );
              }
              if (distributionObject.value && distributionKey === "histogram") {
                return (
                  <BarChart
                    key={distributionKey}
                    data={getChartData(distributionKey)}
                    text={distributionObject.label}
                    volumeTypes={volumeTypes}
                  />
                );
              }
            }
          )}
      </div>
    </div>
  );
}

export default RPDistributionCurves;