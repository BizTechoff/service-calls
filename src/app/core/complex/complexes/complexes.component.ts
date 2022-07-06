import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { BuildingsComponent } from '../../building/buildings/buildings.component';
import { Complex } from '../complex';

@Component({
  selector: 'app-complexes',
  templateUrl: './complexes.component.html',
  styleUrls: ['./complexes.component.scss']
})
export class ComplexesComponent implements OnInit {

  args: {
    pid: string
  } = { pid: '' }
  complexes!: GridSettings<Complex>
  constructor(private remult: Remult) { }
  get $() { return getFields(this, this.remult) };

  @DataControl<ComplexesComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש מתחם' })
  search = ''//customSearch

  async ngOnInit() {
    await this.initGrid()
  }

  async refresh() {
    await this.complexes.reloadData()
  }

  async initGrid() {
    this.complexes = new GridSettings<Complex>(this.remult.repo(Complex), {
      where: { project: this.args.pid?.length ? { $id: this.args.pid } : undefined },
      gridButtons: [{
        icon: 'refresh',
        textInMenu: () => 'רענן',
        click: async () => await this.refresh()
      }],
      rowButtons: [
        {
          click: async (row) => this.openBuildingManagers(row.id),
          showInLine: true
        },
        {
          click: async (row) => this.openBuildings(row.id),
          showInLine: true,
          textInMenu: 'בניינים',
          icon: 'location_city'
        },
        {
          click: async (row) => this.openComplexes(row.id),
          showInLine: true
        }
      ]
    })
  }

  async upsertComplex(cid = '') {
    if (!cid) cid = ''
    let c!: Complex
    let title = ''
    if (cid.length) {
      c = await this.remult.repo(Complex).findId(cid)
      if (!c) throw `Request-Id '${cid}' NOT EXISTS`
      title = `עדכון מתחם ${c.name}`
    }
    else {
      c = this.remult.repo(Complex).create()
      title = 'הוספת מתחם חדשה'
    }
    const changed = await openDialog(InputAreaComponent,
      ref => ref.args = {
        title: title,
        ok: async () => { await c.save() },
        fields: () => [
          c.$.name,
          c.$.project]
      },
      ref => ref ? ref.ok : false)
    if (changed) {
      this.refresh()
    }
  }

  async openBuildingManagers(cid = '') {

  }

  async openBuildings(cid = '') {
    const changed = await openDialog(BuildingsComponent,
      ref => ref.args = {
        cid: cid
      })
  }

  async openComplexes(cid = '') {

  }

}
