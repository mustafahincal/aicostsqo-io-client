import { useUserContext } from "@/contexts/User";
import { SiteBound } from "@/types/models/site";
import { LatLng, LatLngExpression } from "leaflet";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import {
  Circle,
  FeatureGroup,
  MapContainer,
  Polygon,
  TileLayer,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

const WorldMap = ({ next, info, setInfo }: any) => {
  const [siteBounds, setSiteBounds] = useState<SiteBound[] | null>(null);
  const [siteBound, setSiteBound] = useState<SiteBound | null>(null);
  const [polygon, setPolygon] = useState<number[][] | null>(null);
  const { currentUser } = useUserContext();
  const [siteName, setSiteName] = useState<string>("");

  /*   useEffect(() => {
    getSiteBounds()
      .then((res) => {
        if (res.data.success) {
          setSiteBounds(res.data.siteBounds);
        } else {
          console.log(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []); */

  const position: LatLngExpression = [52.515, -0.09];

  const polygonCreated = (e: any) => {
    let polygon: number[][] = [];
    if (e.layerType === "polygon") {
      const latlngs: Array<LatLng> = e.layer._latlngs[0];
      latlngs.forEach((element, index) => {
        /* console.log(
          `${index} - lat ${index + 1}: ` + element.lat?.toFixed(5),
          `- lng ${index + 1}:` + element.lng?.toFixed(5)
        ); */
        polygon.push([
          Number(element.lat?.toFixed(5)),
          Number(element.lng?.toFixed(5)),
        ]);
      });
      setPolygon(polygon);
    }
  };

  /* const polygon: any = [
    [52.515, -0.09],
    [52.52, -0.1],
    [52.52, -0.12],
    [52.5, -0.12],
  ]; */

  const getPositions = (siteBound: SiteBound) => {
    const indexes:
      | LatLngExpression[]
      | LatLngExpression[][]
      | LatLngExpression[][][] = siteBound.vertexes.map((vertex) => {
      return [vertex.coordX, vertex.coordY];
    });
    return indexes;
  };

  const mapSiteBoundObject = (polygon: number[][]) => {
    const siteBound: SiteBound = {
      mapReferenceSystem: "WGS-84",
      vertexes: polygon.map((vertex, index) => {
        return {
          vertexNumber: index + 1,
          coordX: vertex[0],
          coordY: vertex[1],
        };
      }),
    };
    return siteBound;
  };

  const handleAddSiteBound = () => {
    if(siteName === "" || siteName.trim() === "" || siteName === null || siteName === undefined){
      console.log("Site name cannot be empty"); // toastify error
      return;
    }
    const siteBound = mapSiteBoundObject(polygon!);
    setInfo({
      ...info,
      site: {
        ...info.site,
        customerId: currentUser?._id,
        name: siteName,
        numberOfVertex: siteBound.vertexes.length,
      },
      siteBound: {
        ...info.siteBound,
        mapReferenceSystem: siteBound.mapReferenceSystem,
        vertexes: siteBound.vertexes,
      },
    });
    next();
    /* createSiteBound(mapSiteBoundObject(polygon!))
      .then((res) => {
        if (res.data.success) {
          console.log(res.data.message); // toastify success
          getSiteBounds()
            .then((res) => {
              if (res.data.success) {
                setSiteBounds(res.data.siteBounds);
              } else {
                console.log(res.data.message);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log(res.data.message); // toastify error
        }
      })
      .catch((err) => {
        console.log(err);
      }); */
  };

  return (
    <div className="w-full h-[800px] flex flex-col justify-center items-center gap-5">
      <div className="self-start">
        <input
          type="text"
          className="border border-black py-2 px-4"
          value={siteName}
          placeholder="Site Name"
          onChange={(e) => setSiteName(e.target.value)}
        />
      </div>
      <MapContainer
        className="w-full h-full"
        center={position}
        zoom={12}
        scrollWheelZoom={true}
      >
        <FeatureGroup>
          <EditControl
            position="topright"
            draw={{
              rectangle: false,
              circle: false,
              polyline: false,
              marker: false,
              circlemarker: true,
              polygon: {
                shapeOptions: {
                  color: "#ff0000",
                },
              },
            }}
            onCreated={polygonCreated}
          />
          <Circle center={[51.51, -0.06]} radius={200} />
        </FeatureGroup>

        {siteBounds &&
          siteBounds.map((siteBound, index) => {
            return (
              <Polygon
                key={index}
                pathOptions={{ color: "#00ff00" }}
                positions={getPositions(siteBound)}
              />
            );
          })}
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          maxZoom={20}
          subdomains={["mt1", "mt2", "mt3"]}
        />
      </MapContainer>

      <div
        className="w-full bg-black text-white text-center cursor-pointer py-2 px-5 text-lg"
        onClick={handleAddSiteBound}
      >
        Add
      </div>
    </div>
  );
};

export default WorldMap;