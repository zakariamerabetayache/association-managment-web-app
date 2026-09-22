import React, { useState, useEffect } from "react";
import { Select, Button, Space, DatePicker } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useLanguage } from "../../locale/LanguageContext";
import dayjs from "dayjs";

export default function CrudFilters({ config, onFilterChange, onReset }) {
  const [filters, setFilters] = useState({});
  const [dynamicOptions, setDynamicOptions] = useState({});
  const [loadingOptions, setLoadingOptions] = useState({});
  const { translate } = useLanguage();

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    onReset();
  };

  // Early return if no filters configured
  if (!config?.filters || config?.filters?.length === 0) {
    return null;
  }

  // Load dynamic options for filters with loadOptions
  useEffect(() => {
    const loadFilterOptions = async () => {
      for (const filter of config.filters) {
        if (filter.loadOptions && !dynamicOptions[filter.key]) {
          setLoadingOptions((prev) => ({ ...prev, [filter.key]: true }));
          try {
            const options = await filter.loadOptions();
            setDynamicOptions((prev) => ({
              ...prev,
              [filter.key]: options,
            }));
          } catch (error) {
            console.error(
              `Error loading filter options for ${filter.key}:`,
              error
            );
            setDynamicOptions((prev) => ({
              ...prev,
              [filter.key]: [],
            }));
          } finally {
            setLoadingOptions((prev) => ({ ...prev, [filter.key]: false }));
          }
        }
      }
    };

    loadFilterOptions();
  }, [config.filters]);

  const renderFilterInput = (filter) => {
    if (filter.type === "date") {
      return (
        <DatePicker
          style={{ width: "100%" }}
          placeholder={translate(filter.label)}
          value={filters[filter.key] ? dayjs(filters[filter.key]) : null}
          onChange={(date, dateString) => handleFilterChange(filter.key, dateString)}
        />
      );
    }

    return (
      <Select
        style={{ width: "100%" }}
        placeholder={
          loadingOptions[filter.key]
            ? "Loading..."
            : translate(`${config.selectText || "Select"} ${filter.label}`)
        }
        options={
          dynamicOptions[filter.key] ||
          filter.options?.map((option) => ({
            value: option.value,
            label: translate(option.label),
          })) ||
          []
        }
        value={filters[filter.key] || undefined}
        onChange={(value) => handleFilterChange(filter.key, value)}
        loading={loadingOptions[filter.key]}
        allowClear
      />
    );
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "6px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "end",
        gap: "16px",
        backgroundColor: "#fafafa",
        borderRadius: "6px",
        marginBottom: "6px",
      }}
    >
      {config?.filters?.map((filter, index) => (
        <div key={filter.key || index} style={{ minWidth: "200px" }}>
          <label
            style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}
          >
            {translate(filter.label)}
          </label>
          {renderFilterInput(filter)}
        </div>
      ))}
      <Space>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleReset}
          title={translate(config.resetTitle || "Reset Filters")}
        >
          {translate(config.resetText || "Reset")}
        </Button>
      </Space>
    </div>
  );
}
