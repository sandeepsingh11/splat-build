import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseGearResponse } from 'src/app/types';

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
  }

  @Input() list!: BaseGearResponse[];
  @Input() type!: string;
  @Output() newOptionValue: EventEmitter<string> = new EventEmitter();

  filteredList!: BaseGearResponse[];
  selectedItem: string = 'Hed_FST000';
  searchTerm: string = '';

  // filter gear list by search term
  search(e: Event): void {
    this.searchTerm = (e.target as HTMLInputElement).value;

    // if search term is empty, set default
    if (this.searchTerm === '') {
      this.filteredList = this.list;
      this.selectedItem = this.list[0].base_gear_name;
    }
    else {
      // filter
      this.filteredList = this.list.filter((gear: BaseGearResponse) => {
        return (gear.display_name.toLocaleLowerCase().indexOf(this.searchTerm.toLocaleLowerCase()) > -1);
      });
  
      // set selected gear
      if (this.filteredList.length > 0) this.selectedItem = this.filteredList[0].base_gear_name;
      else this.selectedItem = this.list[0].base_gear_name;
    }

    // trigger select change event
    this.onSelectChange(e, true);
  }

  // on select element change via click or search
  onSelectChange(e: Event, searched: boolean = false) {
    if (!searched) {
      this.selectedItem = (e.target as HTMLInputElement).value;
    }

    // emit option change
    this.newOptionValue.emit(this.selectedItem);
  }
}
