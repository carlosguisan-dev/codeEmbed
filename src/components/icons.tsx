import type { SVGProps } from 'react';
import Image from 'next/image';

export function Logo(props: Omit<SVGProps<SVGSVGElement>, 'src'>) {
    return (
        <div {...props} style={{ position: 'relative', width: props.width, height: props.height }}>
            <Image
                src="/logo.svg"
                alt="CodeEmbed Logo"
                fill
                style={{ objectFit: 'contain' }}
            />
        </div>
    )
}
