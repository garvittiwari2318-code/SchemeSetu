import React, { useEffect, useRef, useState } from "react";

interface StateInfo {
  code: string;
  name: string;
  central: number;
  state: number;
  top: string;
}

const STATE_DATA: StateInfo[] = [
  { code: "JK", name: "Jammu & Kashmir", central: 142, state: 38, top: "PM Awas Yojana — Housing for all" },
  { code: "LA", name: "Ladakh", central: 142, state: 30, top: "PM Awas Yojana — Housing for all" },
  { code: "HP", name: "Himachal Pradesh", central: 142, state: 52, top: "Mukhya Mantri Swavalamban Yojana" },
  { code: "PB", name: "Punjab", central: 142, state: 61, top: "Ghar Ghar Rozgar Scheme" },
  { code: "HR", name: "Haryana", central: 142, state: 57, top: "Mukhyamantri Parivar Samridhi Yojana" },
  { code: "UK", name: "Uttarakhand", central: 142, state: 44, top: "Mukhyamantri Swarozgar Yojana" },
  { code: "RJ", name: "Rajasthan", central: 142, state: 74, top: "Mukhya Mantri Laghu Udyog Protsahan Yojana" },
  { code: "UP", name: "Uttar Pradesh", central: 142, state: 89, top: "Mukhyamantri Yuva Swarozgar Yojana" },
  { code: "BR", name: "Bihar", central: 142, state: 63, top: "Bihar Student Credit Card Scheme" },
  { code: "JH", name: "Jharkhand", central: 142, state: 49, top: "Mukhyamantri Protsahan Yojana" },
  { code: "WB", name: "West Bengal", central: 142, state: 71, top: "Krishak Bandhu Scheme" },
  { code: "SK", name: "Sikkim", central: 142, state: 29, top: "Sikkim Organic Mission" },
  { code: "AR", name: "Arunachal Pradesh", central: 142, state: 41, top: "North East Special Package" },
  { code: "AS", name: "Assam", central: 142, state: 55, top: "Arunodoi Scheme — DBT to women" },
  { code: "MN", name: "Manipur", central: 142, state: 39, top: "North East Special Package" },
  { code: "ML", name: "Meghalaya", central: 142, state: 42, top: "North East Special Package" },
  { code: "MZ", name: "Mizoram", central: 142, state: 37, top: "North East Special Package" },
  { code: "NL", name: "Nagaland", central: 142, state: 38, top: "North East Special Package" },
  { code: "TR", name: "Tripura", central: 142, state: 40, top: "North East Special Package" },
  { code: "DL", name: "Delhi", central: 142, state: 48, top: "Rozgar Bazaar — Job Portal" },
  { code: "MP", name: "Madhya Pradesh", central: 142, state: 82, top: "Mukhyamantri Udyam Kranti Yojana" },
  { code: "CG", name: "Chhattisgarh", central: 142, state: 53, top: "Rajiv Gandhi Kisan Nyay Yojana" },
  { code: "GJ", name: "Gujarat", central: 142, state: 78, top: "iKhedut — Farmer welfare portal" },
  { code: "MH", name: "Maharashtra", central: 142, state: 94, top: "Mahatma Phule Jan Arogya Yojana" },
  { code: "GA", name: "Goa", central: 142, state: 31, top: "Dayanand Sahakari — Social security" },
  { code: "KA", name: "Karnataka", central: 142, state: 76, top: "Raitha Siri — Farmer scheme" },
  { code: "TS", name: "Telangana", central: 142, state: 69, top: "Rythu Bandhu — Farmer investment support" },
  { code: "AP", name: "Andhra Pradesh", central: 142, state: 72, top: "YSR Rythu Bharosa — Farmer support" },
  { code: "OD", name: "Odisha", central: 142, state: 67, top: "KALIA — Farmer assistance scheme" },
  { code: "TN", name: "Tamil Nadu", central: 142, state: 85, top: "Chief Minister's Comprehensive Health Insurance" },
  { code: "KL", name: "Kerala", central: 142, state: 68, top: "Karshaka Sreyas — Farmer welfare" },
  { code: "AN", name: "Andaman & Nicobar Islands", central: 142, state: 20, top: "PM Awas Yojana — Housing for all" },
  { code: "LD", name: "Lakshadweep", central: 142, state: 15, top: "PM Awas Yojana — Housing for all" },
  { code: "PY", name: "Puducherry", central: 142, state: 24, top: "PM Awas Yojana — Housing for all" },
  { code: "CH", name: "Chandigarh", central: 142, state: 22, top: "PM Awas Yojana — Housing for all" },
  { code: "DD", name: "Dadra & Nagar Haveli and Daman & Diu", central: 142, state: 18, top: "PM Awas Yojana — Housing for all" },
];

const NAME_TO_CODE: Record<string, string> = {
  "jammu and kashmir": "JK",
  "jammu & kashmir": "JK",
  ladakh: "LA",
  "himachal pradesh": "HP",
  punjab: "PB",
  haryana: "HR",
  uttarakhand: "UK",
  rajasthan: "RJ",
  "uttar pradesh": "UP",
  bihar: "BR",
  jharkhand: "JH",
  "west bengal": "WB",
  sikkim: "SK",
  "arunachal pradesh": "AR",
  assam: "AS",
  manipur: "MN",
  meghalaya: "ML",
  mizoram: "MZ",
  nagaland: "NL",
  tripura: "TR",
  delhi: "DL",
  "madhya pradesh": "MP",
  chhattisgarh: "CG",
  gujarat: "GJ",
  maharashtra: "MH",
  goa: "GA",
  karnataka: "KA",
  telangana: "TS",
  "andhra pradesh": "AP",
  odisha: "OD",
  orissa: "OD",
  "tamil nadu": "TN",
  kerala: "KL",
  "andaman and nicobar islands": "AN",
  "andaman & nicobar islands": "AN",
  lakshadweep: "LD",
  puducherry: "PY",
  pondicherry: "PY",
  chandigarh: "CH",
  "dadra and nagar haveli and daman and diu": "DD",
  "dadra & nagar haveli and daman & diu": "DD",
  "dadra and nagar haveli": "DD",
  "daman and diu": "DD",
};

const SHORT_LABELS: Record<string, string> = {
  JK: "J&K", LA: "Ladakh", HP: "HP", PB: "Punjab", HR: "Haryana",
  UK: "Uttarakhand", RJ: "Rajasthan", UP: "U.P.", BR: "Bihar", JH: "Jharkhand",
  WB: "W.B.", SK: "Sikkim", AR: "Arunachal", AS: "Assam", MN: "Manipur",
  ML: "Meghalaya", MZ: "Mizoram", NL: "Nagaland", TR: "Tripura", DL: "Delhi",
  MP: "M.P.", CG: "C.G.", GJ: "Gujarat", MH: "Maharashtra", GA: "Goa",
  KA: "Karnataka", TS: "Telangana", AP: "A.P.", OD: "Odisha", TN: "Tamil Nadu",
  KL: "Kerala", AN: "A&N", LD: "Lakshadweep", PY: "Puducherry", CH: "Chandigarh",
  DD: "D&NH + D&D",
};

const GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/india.geojson";

function getFillColor(total: number, isSelected: boolean): string {
  if (isSelected) return "#16324f";
  if (total >= 230) return "#1D9E75";
  if (total >= 200) return "#9FE1CB";
  return "#B5D4F4";
}

export const IndiaSchemeMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const d3Ref = useRef<any>(null);
  const zoomRef = useRef<any>(null);
  const selectedCodeRef = useRef<string | null>(null);

  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    selectedCodeRef.current = selectedCode;
  }, [selectedCode]);

  const getFeatureName = (feature: any): string => {
    const properties = feature?.properties || {};
    return (
      properties.NAME_1 ||
      properties.name ||
      properties.NAME ||
      properties.ST_NM ||
      properties.st_nm ||
      properties.ST_NAME ||
      properties.state ||
      properties.State ||
      ""
    );
  };

  const normalizeName = (name: string): string =>
    name.toLowerCase().replace(/\s+/g, " ").trim();

  const getStateCode = (feature: any): string | null => {
    const name = getFeatureName(feature);
    if (!name) return null;
    return NAME_TO_CODE[normalizeName(name)] || null;
  };

  const getStateInfo = (code: string | null): StateInfo | null => {
    if (!code) return null;
    return STATE_DATA.find((s) => s.code === code) || null;
  };

  const drawMap = (d3: any, geojson: any) => {
    const svgElement = svgRef.current;
    const container = containerRef.current;
    if (!svgElement || !container) return;

    const width = Math.max(container.clientWidth, 500);
    const height = 340;
    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%").attr("height", height);

    const mapGroup = svg.append("g").attr("class", "india-map-group");

    const projection = d3
      .geoMercator()
      .fitExtent([[15, 15], [width - 15, height - 15]], geojson);

    const path = d3.geoPath().projection(projection);
    const features = geojson.features || [];

    const mainFeatureByCode = new Map<string, any>();
    features.forEach((feature: any) => {
      const code = getStateCode(feature);
      if (!code) return;
      const existing = mainFeatureByCode.get(code);
      if (!existing) {
        mainFeatureByCode.set(code, feature);
        return;
      }
      try {
        if (d3.geoArea(feature) > d3.geoArea(existing)) {
          mainFeatureByCode.set(code, feature);
        }
      } catch {
        // keep existing
      }
    });

    const getFill = (code: string | null): string => {
      const state = getStateInfo(code);
      if (!state) return "#E8E4DA";
      const total = state.central + state.state;
      return getFillColor(total, code === selectedCodeRef.current);
    };

    const tooltip = d3
      .select(container)
      .selectAll(".india-map-tooltip")
      .data([null])
      .join("div")
      .attr("class", "india-map-tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("display", "none")
      .style("background", "#16324F")
      .style("color", "#FFFFFF")
      .style("padding", "8px 10px")
      .style("border-radius", "8px")
      .style("font-size", "11px")
      .style("line-height", "1.4")
      .style("box-shadow", "0 5px 20px rgba(0,0,0,0.15)")
      .style("z-index", "20");

    const statePaths = mapGroup
      .selectAll(".india-state")
      .data(features)
      .join("path")
      .attr("class", "india-state")
      .attr("d", path)
      .attr("fill", (feature: any) => getFill(getStateCode(feature)))
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .attr("vector-effect", "non-scaling-stroke")
      .style("cursor", (feature: any) => (getStateInfo(getStateCode(feature)) ? "pointer" : "default"));

    statePaths
      .on("mouseenter", function (this: SVGPathElement, event: MouseEvent, feature: any) {
        const code = getStateCode(feature);
        const state = getStateInfo(code);
        if (!state) return;

        d3.select(this).raise().attr("stroke", "#16324F").attr("stroke-width", 2);

        const rect = container.getBoundingClientRect();
        tooltip
          .style("display", "block")
          .html(`<strong>${state.name}</strong><br/>${state.central + state.state} schemes`)
          .style("left", `${event.clientX - rect.left + 12}px`)
          .style("top", `${event.clientY - rect.top + 12}px`);
      })
      .on("mousemove", function (event: MouseEvent) {
        const rect = container.getBoundingClientRect();
        tooltip
          .style("left", `${event.clientX - rect.left + 12}px`)
          .style("top", `${event.clientY - rect.top + 12}px`);
      })
      .on("mouseleave", function (this: SVGPathElement) {
        d3.select(this).attr("stroke", "#ffffff").attr("stroke-width", 1);
        tooltip.style("display", "none");
      })
      .on("click", function (_event: MouseEvent, feature: any) {
        const code = getStateCode(feature);
        if (!code || !getStateInfo(code)) return;

        selectedCodeRef.current = selectedCodeRef.current === code ? null : code;
        setSelectedCode(selectedCodeRef.current);

        statePaths.attr("fill", (item: any) => getFill(getStateCode(item)));
      });

    mainFeatureByCode.forEach((feature, code) => {
      const state = getStateInfo(code);
      if (!state) return;

      const centroid = path.centroid(feature);
      if (!Number.isFinite(centroid[0]) || !Number.isFinite(centroid[1])) return;

      const label = SHORT_LABELS[code] || state.name;

      mapGroup
        .append("text")
        .attr("x", centroid[0])
        .attr("y", centroid[1])
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", code === "MH" || code === "RJ" ? 8 : 6.5)
        .attr("font-weight", "700")
        .attr("fill", "#16324F")
        .attr("pointer-events", "none")
        .text(label);
    });

    const zoom = d3
      .zoom()
      .scaleExtent([1, 6])
      .on("zoom", (event: any) => {
        mapGroup.attr("transform", event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity);

    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;

    const loadMap = async () => {
      try {
        setLoading(true);
        setError(null);

        const d3 = await new Function("url", "return import(url)")(
          "https://cdn.jsdelivr.net/npm/d3@7/+esm"
        );
        if (cancelled) return;
        d3Ref.current = d3;

        const response = await fetch(GEOJSON_URL);
        if (!response.ok) throw new Error("Map data load failed.");
        const geojson = await response.json();
        if (cancelled) return;

        drawMap(d3, geojson);
      } catch (err) {
        console.error("India map error:", err);
        if (!cancelled) {
          setError("Map couldn't load. Please refresh and try again.");
          setLoading(false);
        }
      }
    };

    loadMap();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedState = getStateInfo(selectedCode);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#001d37]">
          Scheme coverage by state
        </span>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#E1F5EE] text-[#085041] font-semibold border border-[#5DCAA5]/40">
          850+ schemes
        </span>
      </div>

      {/* Map */}
      <div
        ref={containerRef}
        className="relative w-full rounded-xl bg-[#f5f3ed] border border-[#c3c6ce]/30 overflow-hidden"
        style={{ height: 340 }}
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f5f3ed]/90">
            <div className="text-center">
              <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-4 border-[#c3c6ce] border-t-[#16324f]" />
              <p className="text-xs font-medium text-[#16324F]">Loading map…</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f5f3ed] px-4">
            <p className="text-xs font-medium text-[#C0392B] text-center">{error}</p>
          </div>
        )}

        <svg
          ref={svgRef}
          className="block w-full"
          role="img"
          aria-label="Interactive map of India showing scheme coverage"
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 px-1">
        <span className="text-[11px] text-[#43474d]">Schemes:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: "#B5D4F4" }} />
          <span className="text-[11px] text-[#43474d]">170–199</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: "#9FE1CB" }} />
          <span className="text-[11px] text-[#43474d]">200–229</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: "#1D9E75" }} />
          <span className="text-[11px] text-[#43474d]">230+</span>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-xl bg-white border border-[#c3c6ce]/30 p-4 min-h-[100px] transition-all">
        {!selectedState ? (
          <p className="text-sm text-[#43474d] text-center mt-4">
            Tap any state to see scheme coverage
          </p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#001d37]">
                {selectedState.name}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#eae8e2] text-[#45617d] font-bold tracking-wider uppercase">
                {selectedState.central + selectedState.state} total
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#f5f3ed] rounded-lg p-3">
                <div className="text-xl font-bold text-[#16324f]">{selectedState.central}</div>
                <div className="text-[11px] text-[#43474d] mt-0.5">Central schemes</div>
              </div>
              <div className="bg-[#E1F5EE] rounded-lg p-3">
                <div className="text-xl font-bold text-[#1D9E75]">{selectedState.state}</div>
                <div className="text-[11px] text-[#085041] mt-0.5">State schemes</div>
              </div>
            </div>

            <div className="bg-[#f5f3ed] rounded-lg p-3 border border-[#c3c6ce]/20">
              <span className="text-[10px] font-bold text-[#1D9E75] tracking-wider uppercase">
                Top scheme
              </span>
              <p className="text-xs text-[#1b1c18] font-medium mt-1 leading-relaxed">
                {selectedState.top}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
