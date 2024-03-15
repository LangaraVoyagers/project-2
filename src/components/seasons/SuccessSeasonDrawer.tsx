import React from "react";
import { Drawer, Button } from "@mui/material";
import IconModalSeason from '../../../assets/icons/season.svg';


interface SuccessDrawerProps {
  open: boolean;
  dismiss: () => void;
}

const SuccessDrawer: React.FC<SuccessDrawerProps> = ({ open, dismiss }) => {
  return (
    <Drawer anchor="right" open={open} onClose={dismiss}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
        }}
      >
        <img
          src={IconModalSeason}
          alt="Icon Picker"
          style={{
            width: "221px",
            height: "229px",
            marginTop: "16px",
          }}
        />
        <div style={{ width: 600, padding: 20 }}>
          <p
            style={{
              color: "var(--Colors-Gray-warm-800, #292524)",
              fontVariantNumeric: "lining-nums tabular-nums",
              fontFeatureSettings: "'liga' off",
              fontSize: 30,
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "38px",
              letterSpacing: "-0.3px",
              textAlign: "center",
              marginTop: "45px",
              marginBottom: "24px",
            }}
          >
            New Season Created!
          </p>
          <p
            style={{
              color: "var(--Colors-Gray-warm-800, #292524)",
              textAlign: "center",
              fontVariantNumeric: "lining-nums tabular-nums",
              fontFeatureSettings: "'liga' off",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "24px",
            }}
          >
            Harvest season 2024 Spring Q1 has
          </p>
          <p
            style={{
              color: "var(--Colors-Gray-warm-800, #292524)",
              textAlign: "center",
              fontVariantNumeric: "lining-nums tabular-nums",
              fontFeatureSettings: "'liga' off",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "24px",
            }}
          >
            been created.
          </p>
        </div>
        <Button
          onClick={dismiss}
          variant="contained"
          color="primary"
          autoFocus
          style={{
            flex: 1,
            marginLeft: "12px",
            height: "56px",
            marginTop: "72px",
          }}
        >
          Back to Harvest Season
        </Button>
      </div>
    </Drawer>
  );
};

export default SuccessDrawer;
