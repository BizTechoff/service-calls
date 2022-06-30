import { Component, OnInit } from '@angular/core';
import { GridSettings } from '@remult/angular/interfaces';
import { Remult } from 'remult';
import { Complex } from '../complex';

@Component({
  selector: 'app-complexes',
  templateUrl: './complexes.component.html',
  styleUrls: ['./complexes.component.scss']
})
export class ComplexesComponent implements OnInit {

  complexes!: GridSettings<Complex>
  constructor(private remult: Remult) { }

  async ngOnInit() {
    await this.initGrid()
  }

  async initGrid() {
    this.complexes = new GridSettings<Complex>(this.remult.repo(Complex), {
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
          click: async (row) => this.openComplexes(row.id),
          showInLine: true
        }
      ]
    })
  }

  async openBuildingManagers(cid = '') {

  }

  async openBuildings(cid = '') {

  }

  async openComplexes(cid = '') {

  }

}
