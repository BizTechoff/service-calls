import { Component, OnInit } from '@angular/core';
import { Fields, getFields, Remult } from 'remult';
import { User } from './user';

import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { DialogService } from '../common/dialog';
import { InputAreaComponent } from '../common/input-area/input-area.component';
import { terms } from '../terms';
import { Roles } from './roles';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  constructor(private dialog: DialogService, public remult: Remult) {
  }
  get $() { return getFields(this, this.remult) };

  @DataControl<UsersComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש פרוייקט' })
  search = ''//customSearch

  async ngOnInit() {
    // await this.initGrid()
  }

  async refresh() {
    await this.users.reloadData()
  }
  isAdmin() {
    return this.remult.isAllowed(Roles.admin);
  }

  users = new GridSettings(this.remult.repo(User), {
    allowDelete: true,
    allowInsert: true,
    allowUpdate: true,
    numOfColumnsInGrid: 10,

    // orderBy: { name: "asc" },
    rowsInPage: 25,

    columnSettings: users => [
      users.name,
      users.mobile,
      users.admin,
      users.bedekManager,
      users.bedek,
      users.inspector,
      users.constructionContractor,
      users.subContractor,
      users.tenant
    ],
    gridButtons: [{
      icon: 'refresh',
      textInMenu: () => 'רענן',
      click: async () => await this.refresh()
    }],
    rowButtons: [{
      icon: 'password',
      name: terms.resetPassword,
      click: async () => {

        if (await this.dialog.yesNoQuestion(terms.passwordDeleteConfirmOf + " " + this.users.currentRow.name)) {
          await this.users.currentRow.resetPassword();
          this.dialog.info(terms.passwordDeletedSuccessful);
        };
      }
    }
    ],
    confirmDelete: async (h) => {
      return await this.dialog.confirmDelete(h.name)
    },
  });

  async upsertUser(uid = '') {
    if (!uid) uid = ''
    let u!: User
    let title = ''
    if (uid.length) {
      u = await this.remult.repo(User).findId(uid)
      if (!u) throw `Project-Id '${uid}' NOT EXISTS`
      title = `עדכון משתמש ${u.name}`
    }
    else {
      u = this.remult.repo(User).create()
      title = 'הוספת משתמש חדש'
    }
    const changed = await openDialog(InputAreaComponent,
      ref => ref.args = {
        title: title,
        ok: async () => { await u.save() },
        fields: () => [
          u.$.name,
          u.$.mobile,
          u.$.email]
      },
      ref => ref ? ref.ok : false)
    if (changed) {
      this.refresh()
    }
  }

}
