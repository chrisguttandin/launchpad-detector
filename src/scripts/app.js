const LAUNCHPAD_MINI_REGEX = /^Launchpad\sMini$/;
const LAUNCHPAD_MK2_REGEX = /^Launchpad\sMK2(?:\s[1-9]|(?:1[0-6]))?$/;
const LAUNCHPAD_PRO_REGEX = /^Launchpad\sPro\sStandalone\sPort|(?:MIDIIN2|MIDIOUT2)\s\(Launchpad\sPro\)$/;
const LAUNCHPAD_S_REGEX = /^Launchpad\sS$/;

function augment (devices) {
    return devices
        .map((device) => {
            let type = 'no Launchpad';

            if (device.input !== undefined) {
                const { name } = device.input;

                if (LAUNCHPAD_MINI_REGEX.test(name)) {
                    type = 'Launchpad Mini';
                } else if (LAUNCHPAD_MK2_REGEX.test(name)) {
                    type = 'Launchpad MK2';
                } else if (LAUNCHPAD_PRO_REGEX.test(name)) {
                    type = 'Launchpad Pro';
                } else if (LAUNCHPAD_S_REGEX.test(name)) {
                    type = 'Launchpad S';
                }
            } else if (device.output !== undefined) {
                const { name } = device.output;

                if (LAUNCHPAD_MINI_REGEX.test(name)) {
                    type = 'Launchpad Mini';
                } else if (LAUNCHPAD_MK2_REGEX.test(name)) {
                    type = 'Launchpad MK2';
                } else if (LAUNCHPAD_PRO_REGEX.test(name)) {
                    type = 'Launchpad Pro';
                } else if (LAUNCHPAD_S_REGEX.test(name)) {
                    type = 'Launchpad S';
                }
            }

            return { device, type };
        });
}

function group ({ inputs, outputs }) {
    const devices = [ ];

    for (const [ , { manufacturer, name } ] of inputs) {
        devices.push({ input: { manufacturer, name } });
    }

    for (const [ , { manufacturer, name } ] of outputs) {
        const index = devices
            .filter(({ input }) => (input !== undefined))
            .findIndex(({ input: { name: nm } }) => nm === name);

        if (index > -1) {
            devices[index] = { ...devices[index], output: { manufacturer, name } };
        } else {
            devices.push({ output: { manufacturer, name } });
        }
    }

    return devices;
}

function log (devicesAndTypes) {
    const $connectedDevices = document.getElementById('connected-devices');

    $connectedDevices.textContent = '';

    for (const { device, type } of devicesAndTypes) {
        const $br = document.createElement('br');
        const $deviceSpan = document.createElement('span');
        const $item = document.createElement('li');
        const $typeSpan = document.createElement('span');

        $deviceSpan.textContent = `device: ${ JSON.stringify(device) }`;
        $typeSpan.textContent = `type: ${ JSON.stringify(type) }`;

        $item.appendChild($deviceSpan);
        $item.appendChild($br);
        $item.appendChild($typeSpan);

        $connectedDevices.appendChild($item);
    }
}

if (navigator.permissions !== undefined && navigator.requestMIDIAccess !== undefined) {
    navigator.permissions
        .query({ name: 'midi' })
        .then(() => navigator.requestMIDIAccess())
        .then((midiAccess) => {
            midiAccess.onstatechange = () => log(augment(group(midiAccess)));

            log(augment(group(midiAccess)));
        });
}
