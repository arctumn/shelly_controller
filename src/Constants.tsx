export const key = process.env.REACT_APP_KEY ? process.env.REACT_APP_KEY : ""
const id_painel = process.env.REACT_APP_PAINEL_ID ? process.env.REACT_APP_PAINEL_ID : ""
const id_edp = process.env.REACT_APP_EDP_ID ? process.env.REACT_APP_EDP_ID : ""
const PORTAO_ID = process.env.REACT_APP_PORTAO_ID ? process.env.REACT_APP_PORTAO_ID : ""
const WATER_PLUG_ID = process.env.REACT_APP_WATER_PLUG_ID ? process.env.REACT_APP_WATER_PLUG_ID : ""
export const device_id_list = [id_painel,id_edp,PORTAO_ID,WATER_PLUG_ID]