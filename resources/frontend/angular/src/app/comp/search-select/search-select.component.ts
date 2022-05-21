import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseGearResponse, SearchSelectOutput, WeaponResponse } from 'src/app/types';

@Component({
  selector: 'app-search-select',
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.scss']
})
export class SearchSelectComponent implements OnChanges {

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredList = changes['list'].currentValue;

    if (this.type === 'gear') {
      this.selectedItem = 'Hed_FST000';
    }
    else {
      this.selectedItem = 'Shooter_Short_00';
    }
  }

  @Input() list!: any;
  @Input() type!: 'gear' | 'weapon';
  @Output() newOption: EventEmitter<SearchSelectOutput> = new EventEmitter();

  filteredList!: BaseGearResponse[] & WeaponResponse[];
  selectedItem!: string;
  searchTerm: string = '';

  // filter gear list by search term
  search(e: Event): void {
    this.searchTerm = (e.target as HTMLInputElement).value;

    // if search term is empty, set default
    if (this.searchTerm === '') {
      this.filteredList = this.list;
      this.selectedItem = this.list[0].name;
    }
    else {
      // filter
      this.filteredList = this.list.filter((item: BaseGearResponse | WeaponResponse) => {
        return (
          item.display_name.toLocaleLowerCase()
          .indexOf(this.searchTerm.toLocaleLowerCase()) > -1
        );
      });
  
      // set selected gear
      if (this.filteredList.length > 0) this.selectedItem = this.filteredList[0].name;
      else this.selectedItem = this.list[0].name;
    }

    // trigger select change event
    this.onSelectChange(e, true);
  }

  // on select element change via click or search
  onSelectChange(e: Event, searched: boolean = false) {
    const selectedItem: string = (searched) ? this.selectedItem : (e.target as HTMLInputElement).value;
    const type: 'gear' | 'weapon' = this.type;
    let displayName: string = (type === 'gear') ? 'White Headband' : 'Sploosh-o-matic';
    let subName!: string;
    let specialName!: string;

    // set display name (every() used to break out of the loop)
    this.filteredList.every((item) => {
      if (item.name === selectedItem) {
        displayName = item.display_name;
        return false;
      };
      return true;
    });

    // if weapon, get sub and special names
    if (this.type === 'weapon') {
      this.filteredList.every((weapon: WeaponResponse) => {
        if (weapon.name === selectedItem) {
          subName = weapon.sub_name;
          specialName = weapon.special_name;
          return false;
        };
        return true;
      });
    }

    // emit option change
    this.newOption.emit({selectedItem, type, displayName, subName, specialName});
  }
}
