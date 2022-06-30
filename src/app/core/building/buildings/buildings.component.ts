import { Component, OnInit } from '@angular/core';
import { GridSettings } from '@remult/angular/interfaces';
import { Remult } from 'remult';
import { Building } from '../building';

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss']
})
export class BuildingsComponent implements OnInit {

  complexes!: GridSettings<Building>
  constructor(private remult: Remult) { }

  async ngOnInit() {
    await this.initGrid()
  }

  async initGrid() {
    this.complexes = new GridSettings<Building>(this.remult.repo(Building), {
      rowButtons: [
        {
          click: async (row) => this.openBuildingManagers(row.id),
          showInLine: true
        },
        {
          click: async (row) => this.openBuildings(row.id),
          showInLine: true
        },
        {
          click: async (row) => this.openBuildinges(row.id),
          showInLine: true
        }
      ]
    })
  }

  async openBuildingManagers(cid = '') {

  }

  async openBuildings(cid = '') {

  }

  async openBuildinges(cid = '') {

  }

}
