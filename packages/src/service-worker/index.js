"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workbox_routing_1 = require("workbox-routing");
const workbox_precaching_1 = require("workbox-precaching");
const navigation_1 = __importDefault(require("src/service-worker/routes/navigation"));
const resources_1 = __importDefault(require("src/service-worker/routes/resources"));
const offline_1 = __importStar(require("src/service-worker/routes/offline"));
(0, workbox_precaching_1.precacheAndRoute)(self.__WB_MANIFEST);
self.addEventListener('install', async (event) => {
    event.waitUntil(caches
        .open(offline_1.OFFLINE_CACHE_NAME)
        .then((cache) => cache.add(offline_1.FALLBACK_HTML_URL)));
});
(0, workbox_routing_1.registerRoute)(navigation_1.default);
(0, workbox_routing_1.registerRoute)(resources_1.default);
(0, workbox_routing_1.setCatchHandler)(offline_1.default);
//# sourceMappingURL=index.js.map