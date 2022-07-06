import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { User } from '../../../users/user';

@Component({
  selector: 'app-inspectors',
  templateUrl: './inspectors.component.html',
  styleUrls: ['./inspectors.component.scss']
})
export class InspectorsComponent implements OnInit {

  tenants!: GridSettings<User>
  constructor(private remult: Remult) { }

  get $() { return getFields(this, this.remult) };

  @DataControl<InspectorsComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש מפקח' })
  search = ''//customSearch

  async ngOnInit() {
    await this.initGrid()
  }

  async refresh() {
    await this.tenants.reloadData()
  }

  async initGrid() {
    this.tenants = new GridSettings<User>(this.remult.repo(User), {
      where: { inspector: true },
      numOfColumnsInGrid: 10,
      columnSettings: (row) => [
        row.name,
        row.mobile,
        row.email
      ],
      rowButtons: [
        {
          click: async (row) => this.openBuilding(row.id),
          showInLine: true
        },
        {
          click: async (row) => this.openRequests(row.id),
          showInLine: true
        }
      ]
    })
  }

  async upsertInspector(iid = '') {
    if (!iid) iid = ''
    let i!: User
    let title = ''
    if (iid.length) {
      i = await this.remult.repo(User).findId(iid, {useCache : false})
      if (!i) throw `Inspector-Id '${iid}' NOT EXISTS`
      title = `עדכון מפקח ${i.name}`
    }
    else {
      i = this.remult.repo(User).create()
      i.inspector = true
      title = 'הוספת מפקח חדש'
    }
    const changed = await openDialog(InputAreaComponent,
      ref => ref.args = {
        title: title,
        ok: async () => { await i.save() },
        fields: () => [
          i.$.name,
          i.$.mobile,
          i.$.email]
      },
      ref => ref ? ref.ok : false)
    if (changed) {
      this.refresh()
    }
  }


  async openBuilding(tid = '') {

  }

  async openRequests(tid = '') {

  }

}
