import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

type ThingWithExtraValues = {
  moo: string;
  cow?: string;
  [x: string]: string;
};

const moo: ThingWithExtraValues = {
  moo: 'moo', // Works
};

moo.cow = 'cow'; // This is fine

moo.somethingElse = 'woo'; // This is also fine

// const moo2: ThingWithExtraValues = {
//   cow: 'cow', // Doesn't work since `moo` is required
// };

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  form = new FormGroup<{
    firstname: FormControl<string | null>;
    lastname: FormControl<string | null>;
    // id?: FormControl<string | null>; // <-- uncomment this to allow patching id FormControl even if it doesn't exist
    //
    // NOTE: This doesn't actually make the `patchValue` "work"
    // since you are required to add that FormControl first
    //
    // You will not get a type error to help you through this process
  }>({
    firstname: new FormControl(null),
    lastname: new FormControl(null),
  });

  // You can infer the generic type like this, but you gotta be careful
  // This assumes that .reset() will not set back to `null`
  // form = this.fb.group({
  //   firstname: 'moo',
  //   lastname: 'cow',
  // });

  constructor(private readonly fb: FormBuilder) {
    // this.form.setValue({
    //   firstname: 'aj', // '{ firstname: string; }' is not assignable to parameter of type '{ ... }'
    // });

    this.form.patchValue({
      firstname: 'aj', // works~ :D
    });

    type PatchValue = Parameters<typeof this.form.patchValue>[0];
    /*
    Partial<{
      firstname: string;
      lastname: string;
    }>
    */

    // Without this line, the `patchValue` will not have a type error
    // if your generic (above) says `id` might be defined
    // this.form.addControl('id', new FormControl());
    const asdf = {
      id: '123abc',
      lastname: 'wiebe'
    } satisfies PatchValue;

    this.form.patchValue({
      // id: '123abc', // '{ id: string; lastname: string; }' is not assignable to parameter of type 'Partial<{ ... }>'.
      lastname: 'wiebe',
    });

    console.log(this.form);

    // This would be safer to use since you are reminded that `id`
    // might not be defined
    // this.form.controls.id.setValue();

    // How to strip extra stuff from payload
    // so that strict types doesn't yell at you
    const payload = {
      firstname: 'moo',
      lastname: 'cow',
      id: 123123123,
      changedBy: Date.now(),
      lastChangedDate: new Date(),
    };

    const { id, changedBy, lastChangedDate, ...patchValue } = payload;

    this.form.patchValue(patchValue);
    // /* or */ this.form.setValue(patchValue);

    // const control = this.form.get('id');
    // Runtime Error: Cannot read properties of null (reading 'setValue')
    // control.setValue(123123123); // Argument of type 'number' is not assignable to parameter of type 'never'.
  }
}
