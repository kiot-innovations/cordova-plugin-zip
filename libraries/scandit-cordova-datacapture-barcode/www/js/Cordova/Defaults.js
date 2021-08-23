"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <amd-module name="scandit-cordova-datacapture-barcode.Defaults"/>
// ^ needed because Cordova can't resolve "../xx" style dependencies
const Barcode_1 = require("scandit-cordova-datacapture-barcode.Barcode");
const Camera_Related_1 = require("scandit-cordova-datacapture-core.Camera+Related");
const Common_1 = require("scandit-cordova-datacapture-core.Common");
exports.defaultsFromJSON = (json) => {
    return {
        SymbologySettings: Object.keys(json.SymbologySettings)
            .reduce((settings, identifier) => {
            settings[identifier] = Barcode_1.SymbologySettings
                .fromJSON(JSON.parse(json.SymbologySettings[identifier]));
            return settings;
        }, {}),
        SymbologyDescriptions: json.SymbologyDescriptions.map(description => Barcode_1.SymbologyDescription.fromJSON(JSON.parse(description))),
        CompositeTypeDescriptions: json.CompositeTypeDescriptions.map(description => JSON.parse(description)),
        BarcodeCapture: {
            BarcodeCaptureOverlay: {
                DefaultBrush: {
                    fillColor: Common_1.Color
                        .fromJSON(json.BarcodeCapture.BarcodeCaptureOverlay.DefaultBrush.fillColor),
                    strokeColor: Common_1.Color
                        .fromJSON(json.BarcodeCapture.BarcodeCaptureOverlay.DefaultBrush.strokeColor),
                    strokeWidth: json.BarcodeCapture.BarcodeCaptureOverlay.DefaultBrush.strokeWidth,
                },
            },
            BarcodeCaptureSettings: {
                codeDuplicateFilter: json.BarcodeCapture.BarcodeCaptureSettings.codeDuplicateFilter,
            },
            RecommendedCameraSettings: Camera_Related_1.CameraSettings
                .fromJSON(json.BarcodeCapture.RecommendedCameraSettings),
        },
        BarcodeTracking: {
            RecommendedCameraSettings: Camera_Related_1.CameraSettings
                .fromJSON(json.BarcodeTracking.RecommendedCameraSettings),
            BarcodeTrackingBasicOverlay: {
                DefaultBrush: {
                    fillColor: Common_1.Color
                        .fromJSON(json.BarcodeTracking.BarcodeTrackingBasicOverlay.DefaultBrush.fillColor),
                    strokeColor: Common_1.Color
                        .fromJSON(json.BarcodeTracking.BarcodeTrackingBasicOverlay.DefaultBrush.strokeColor),
                    strokeWidth: json.BarcodeTracking.BarcodeTrackingBasicOverlay.DefaultBrush.strokeWidth,
                },
            },
        },
    };
};
