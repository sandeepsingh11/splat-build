import { Gear } from "./gear";

export interface Gearset {
    gearset_title: string,
    gearset_desc: string,
    gearset_mode_rm: boolean,
    gearset_mode_cb: boolean,
    gearset_mode_sz: boolean,
    gearset_mode_tc: boolean,
    created_at: string,
    updated_at: string,
    weapon_name: string,
    weapon_class: string,
    special_name: string,
    sub_name: string,
    gears?: Gear[]
}