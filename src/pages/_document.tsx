// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, {Head, Html} from 'next/document'
import {ServerStyleSheet} from 'styled-components'
import React from "react";


// todo : hydration 과정에서 다른파일을 로드해주기 때문에 document에서 sheet가 온전히 로드되게 해주어야 한다.(새로고침시 css 깨지는 현상)
export default class MyDocument extends Document {

    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
                })

            const initialProps = await Document.getInitialProps(ctx)
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                )
            }
        } finally {
            sheet.seal()
        }
    }
}
