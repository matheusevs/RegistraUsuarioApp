/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {
  chamaAlert(email){
    this.presentAlertConfirm(email);
  }

  excluirDado(email){
    const arrRowsTable = JSON.parse(localStorage.getItem('arrRowsTable'));
    const newArr = [];

    for(let i = 0; i < arrRowsTable.length; i++){
      if(email != arrRowsTable[i].email){
          newArr.push(arrRowsTable[i]);
      }
    }

    localStorage.setItem('arrRowsTable', JSON.stringify(newArr));
    this.ionViewWillEnter();
  }

  ionViewWillEnter(){
    let tabela = (<HTMLTableElement >document.querySelector('#tabela tbody'));
    tabela.innerHTML = '';
    const arrRowsTable = JSON.parse(localStorage.getItem('arrRowsTable'));

    let linha; let cellUsuario; let cellEmail; let lixo;


    for(let i = 0; i < arrRowsTable.length; i++){
      linha = tabela.insertRow();
      cellUsuario = linha.insertCell(0);
      cellEmail = linha.insertCell(1);
      lixo = linha.insertCell(2);

      cellUsuario.innerHTML = arrRowsTable[i].nome;
      cellEmail.innerHTML = arrRowsTable[i].email;
      lixo.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
      lixo.addEventListener(`click`, ()=> this.chamaAlert(arrRowsTable[i].email));
    }
  }

  constructor(public alertController: AlertController) { }

  async presentAlertConfirm(email) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Tem certeza que deseja deletar?',
      message: 'Ao deletar esse registro, não será possível a <strong>recuperação</strong>!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.excluirDado(email);
          }
        }
      ]
    });

    await alert.present();
  }

}
