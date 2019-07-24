import ReactiveStorageInterface, { ReactiveStorageInstance } from '@/../lib/types/mainClass';

interface StorePreset {
    name: string;
    id: number;
}

const preset: StorePreset = {
    name: 'ret',
    id: 1423
}

const ReactiveStorage: ReactiveStorageInterface;

let a: ReactiveStorageInstance<StorePreset> = ReactiveStorage.create<StorePreset>(preset);



