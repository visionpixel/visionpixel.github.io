// import { JwtCredentialPayload, createVerifiableCredentialJwt } from 'did-jwt-vc'
import { ES256KSigner, hexToBytes } from 'did-jwt';
import { createVerifiableCredentialJwt, createVerifiablePresentationJwt, verifyCredential, verifyPresentation } from 'did-jwt-vc'
import { Resolver } from 'did-resolver'
import { getResolver } from 'web-did-resolver'


// Create a singer by using a private key (hex).
const key = '18e4d830313dc3d2d7dc26d1396c29d7d77727d07ed38fcc0918f34aa07a90d6';
const signer = ES256KSigner(hexToBytes(key))

// Prepare an issuer
const issuer = {
    did: 'did:web:visionpixel.github.io',
    signer: signer
}

// Prepare the Verifiable Credential Payload
const vcPayload = {
    sub: 'did:web:visionpixel.github.io',
    nbf: 1562950282,
    vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        credentialSubject: {
            degree: {
                type: 'BachelorDegree',
                name: 'Baccalauréat en musiques numériques'
            }
        }
    }
}

// Create the Verifiable Credential (JWT)
const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer)
console.log('//// Verifiable Credential:\n', vcJwt)

// Prepare the Verifiable Presentation Payload
const vpPayload = {
    vp: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiablePresentation'],
        verifiableCredential: [vcJwt],
        foo: "bar"
    }
}

// Create the Verifiable Presentation (JWT)
const vpJwt = await createVerifiablePresentationJwt(vpPayload, issuer)
console.log('\n//// Verifiable Presentation:\n', vpJwt)

// Resolve and Verify

// Prepare the did:web resolver
const resolver = new Resolver(getResolver())

// Verify the Credentantial and the Presentation
const verifiedVC = await verifyCredential(vcJwt, resolver)
console.log('//// Verified Credentials:\n', verifiedVC)

const verifiedVP = await verifyPresentation(vpJwt, resolver)
console.log('\n//// Verified Presentation:\n', verifiedVP)
