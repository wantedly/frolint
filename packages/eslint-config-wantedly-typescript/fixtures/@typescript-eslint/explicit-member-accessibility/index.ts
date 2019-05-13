/* eslint-disable @typescript-eslint/no-unused-vars */

class Animal {
  constructor(name: string) {
    // Parameter property and constructor
    this.animalName = name;
  }
  public animalName: string; // Property
  get name(): string {
    // get accessor
    return this.animalName;
  }
  set name(value: string) {
    // set accessor
    this.animalName = value;
  }
  public walk() {
    // method
  }
}
